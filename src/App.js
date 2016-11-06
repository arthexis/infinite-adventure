import React, { Component } from 'react';
import './App.css';

var utils = require('./utils.js');

class App extends Component {

  constructor () {
    super()
    // Initial message shown to the player
    const initialMessage = (
      <div>
        <h2>You are ready to go on an adventure.</h2>
        Click the button to the left to grab your belongings and begin your quest. <br />
        Your stats are shown below, keep an eye on them. After earning some gold, you can purchase 
        stuff from the marketplace to make your quest easier and more productive.<br /> 
        Using the Marketplace resets your current adventure progress and restores all your Health.
      </div>
    );  
    // The state of the App should hold all data that we are interested
    // in saving or loading across game sessions
    this.state = {
      ticks: 0,
      clicks: 0,
      message: initialMessage,
      // Game Resources start here
      gold: 123567234465121234560,
      lv: 1,
      xp: 0,
      hp: 12,
      hpMax: 12,
      sword: 2,
      armor: 0,
      lvFactor: 50,
      floor: 0,
      room: 0,
      rank: 1,
      regen: 0.5,
      resting: false,
      gems: 0,
      bank: 0,
      hpBonus: 3,
      interest: 1,
      upkeep: 0, 
      mount: 0,
      potion: 0
    };
    // Determines how fast the game moves, 1000 = 1 second
    this.rate = 1000;
  }

  // Called when the Component has been rendered and there is a DOM available
  componentDidMount() {
    console.log("Component mounted");
    this.interval = setInterval(this.tick, this.rate);
  }

  // Executed on every tick of the game (every this.state.rate milliseconds)
  // This is typically where you regenerate spent resources or work down cooldowns
  tick = () => {
    this.setState((prevState, props) => {

      // Prepare the state for updating
      let ns = prevState;
      ns.ticks++;

      // Apply HP regeneration and stuff that happens when hp regenerates
      if (ns.hp < ns.hpMax) {
        if ((ns.hp += ns.regen) >= ns.hpMax) { 
          if (ns.hp = ns.hpMax && ns.resting) {
            ns.resting = false; ns.clicks++;
            ns.message = (
              <div>
                <h2>Day {ns.clicks}</h2>
                You wake up back in town with a headache. 
                After taking some time to rest, you feel ready to continue your adventure. 
                Consider buying something from the Marketplace to ease your journey.
              </div>
            ); 
      }}}

      // Return the modified state after a tick
      return ns;
    }); 
  }

  // Called every time the user clicks the Adventure! button, moves the game forward
  click = () => {
    this.setState((ns, props) => {

      // Define all the things we are going to use to calculate state at the end
      ns.clicks++;
      ns.message = "";
      ns.xp++;
      ns.hp = Math.floor(ns.hp);
      ns.resting = false;

      // Determine the random encounter
      let message = "";
      let reward = 0, rounds = 0;
      if (ns.floor) {

        // Generate monsters for the encounter
        const monsterName = utils.getRandMonster();
        let monsterCount = 0, roomsSkipped = 0;

        while (true) {
          monsterCount = Math.floor(Math.random() * (ns.floor + ns.rank));
          if (monsterCount > ns.mount - 1 ) {
            break;
          } else {
            // Calculate number of rooms skipped by using mount
            this.floorCheck(ns);
            roomsSkipped++;
          }
        }
        if (roomsSkipped) {
          message += " Skipped " + roomsSkipped + " room" + 
            (roomsSkipped > 1 ? "s": "") + " with your mount." ;
        }

        reward = monsterCount * (ns.rank + ns.floor) * 5;
        let totalBlocked = 0, totalPlayerDamage = 0;
        
        if (monsterCount < 1) {
          message += " No monsters on sight as you march on."
        } else {
          message += " You encounter " + monsterCount + " " + monsterName + 
            (monsterCount > 1? "s" : "") + " and combat ensues!";

          // Simulate a fight between player and monsters
          // Every round, player takes up to 1 damage per Rank per monster
          // and at the same time the player kills 1 monster per point in their Sword stat
          while (monsterCount > 0 && ns.hp > 0) {
            rounds++;
            let playerBlocked = Math.round(Math.random() * ns.armor); 
            let playerDamage = Math.floor(ns.rank + Math.random() * monsterCount * ns.rank);
            if (playerBlocked > playerDamage) { playerBlocked = playerDamage; }
            playerDamage -= playerBlocked;
            let monsterDamage = Math.floor(ns.lv + Math.random() * ns.sword);
            if (playerDamage < 0) { playerDamage = 0; }
            totalPlayerDamage += playerDamage;
            totalBlocked += playerBlocked;
            ns.hp -= totalPlayerDamage;
            monsterCount -= monsterDamage;
          }
          ns.xp += rounds; // Player gets +1 xp per round of battle
          message += " Fought " + rounds + " round" + (rounds > 1 ? "s." : ".");
          if (totalBlocked) { message += " " + totalBlocked + " damage blocked." }
          if (totalPlayerDamage) {
             message += " Took " + totalPlayerDamage + " damage. "
          }

          // Check the final result of the battle
          if (monsterCount <= 0 && ns.hp >= 1) {
            message += " You are victorious! Found " + reward + " gold."
          }
        }

        // Advance room and check if the floor has been completed
        if (this.floorCheck(ns)) {
          ns.message += " You find stairs leading down."
        }

        // Check if the player is too damaged to continue
        if (ns.hp < 1) {

          // Spend a potion to prevent defeat if available
          if (ns.potion > 0) {
            ns.potion--;
            ns.hp = Math.round(ns.hpMax / 4);
            message += " Health potion used."

          } else {

            // Assign penalties for defeat 
            let days = this.travelTime(ns.floor);
            ns.bank += this.calculateInterest(ns.bank, ns.interest, days);
            reward *= -10; ns.hp = 0; ns.floor = 0; ns.room = 0; ns.resting = true;
            ns.clicks += days;
            message += " You are defeated. Monsters ran away with " + 
              Math.abs(reward) + " gold. You are unconcious."
            if (ns.gold + reward < 1) { reward = ns.gold * -1; }
            if (ns.rank > 1) { 
              ns.rank <= 1;
              message += " You've lost 1 Rank." 
            }
          }
        } else {
          // Chance to find a gem if not unconcious 
          const gemsFound = Math.floor(Math.random() * ns.rank);
          if (gemsFound >= 1) {
            message += " Found " + gemsFound + " gems!";
            ns.gems += gemsFound;
          }
        }

        // Calculate upkeep costs of battle 
        if (ns.upkeep > 0) {
          let upkeep = Math.round(Math.random() * ns.upkeep * rounds);
          if (upkeep > reward) { upkeep = reward; }
          if (upkeep > 0 ) {
            message += " Upkeep: " + upkeep + " gold.";
            reward -= upkeep;
          }
        }

        // Apply reward (this is a penalty instead if the player died)
        ns.gold += reward;

      } else {
        // Message when entering the dungeon at first
        message += " Before you stands the entrance to an ancient ruin."
        ns.floor++;
      }

      // Check for level up
      if (ns.xp >= ns.lv * ns.lvFactor ) { 
        ns.xp = 0; ns.lv++; ns.hpMax +=  ns.hpBonus; ns.hp += ns.hpBonus; 
        message += " You gained a Level!";
      } 

      // Apply interest gains when gold is in the bank 
      ns.bank += this.calculateInterest(ns.bank, ns.interest, 1);

      // Prepare the message that will be rendered to the user
      ns.message = (
        <div>
          <h2>Day {this.state.clicks}</h2>
          You adventure.{message}
        </div>
      );

      // Return the final computed state  
      return ns;
    }); 
  }

  // Advance room and check if floor is complete
  floorCheck(ns) {
    if (ns.room++ >= ns.floor) {
          ns.floor++; ns.room = 0;
          return true;
    }
    return false;
  }

  travelTime(floors) {
    let travelTime = floors - 1 - this.state.mount;
    if (travelTime < 1) { return 1; } 
    return travelTime;
  }

  calculateInterest(bank, interest, days) {
    return (bank * interest * days / 500.0) || 0;
  }

  // Render the React component if anything has been updated
  render() {

    // Render fixed components with optional components added in
    return (
      <div className="app">
        <div className="top">
          <div className="clicker">
            <button onClick={this.click} disabled={this.state.resting}>
              {this.state.resting ? "Resting" : "Adventure!"}
            </button>  
          </div>
          <div className="info">{this.state.message}</div>
        </div>
        {this.renderResources()}
        {this.renderMarketplace()}
      </div>
    );
  }

  // Helper to render generic resurces 
  // TODO Good candidate to become a React class of its own
  resource(key) {
    return this.state[key] > 0 ? 
      <div>{utils.toTitleCase(key)} {utils.formatNum(this.state[key])}</div> : 
      null;
  }

  // Render the resource indicators
  renderResources() {

    // Render the optional resource indicators
    // These are resources that cannot be rendered with the this.resource() helper
    let floor;
    if (this.state.floor) { 
      if (this.state.room) {
        floor = <div>Floor {this.state.floor}: Chamber {this.state.room}</div>;
      } else {
        floor = <div>Floor {this.state.floor}: Stairs</div>
      } 
    }

    // Render the always present resource indicators, inserting the optional ones
    return (
      <div className="resources">
        <div>Level {this.state.lv} ({this.state.xp} / {this.state.lv * this.state.lvFactor})</div>
        {this.resource("rank")}
        <div>Gold {utils.formatNum(this.state.gold)}</div>
        <div>Health {Math.floor(this.state.hp)} / {this.state.hpMax}</div>
        <div>Regen {this.state.regen}</div>
        <div>Sword +{this.state.sword}</div>
        {this.resource("armor")}
        {floor}
        {this.resource("gems")}
        {this.resource("bank")}
        {this.resource("upkeep")}
        {this.resource("mount")}
        {this.resource("potion")}
      </div>
    );
  }

  // Render the elements that make up the marketplace
  renderMarketplace() {
    const items = this.getMarketItems();
    return (
      <div className="marketplace"><h3>Marketplace</h3><table>{ 
        items.map((item) => {return (
            <tr><td className="item-btn">
            <button onClick={() => this.buy(item)} disabled={this.state.resting || !this.budget(item)} >
                {item.action}
            </button></td>
            <td className="item-cost"> {item.cost} Gold.</td>
            <td className="item-info">{item.info}</td></tr>
        )})}
      </table></div>
    );
  }

  // Get an array of available marketplace items
  getMarketItems() {
    return [
      {
        action: "Deposit Gold",
        cost: 10,
        info: "Deposits remaining gold in the bank. Gain 1% interest every 5 adventure days.",
        onBuy: (ns) => {
          ns.message = "You deposit " + ns.gold + " gold into your bank account."
          ns.bank += ns.gold;
          ns.gold = 0; 
          return ns;
        },
      },
      {
        action: "Healing Potion",
        cost: 2 * ((5 * (this.state.potion + 1)) ** 2),
        info: "Carry +1 Potion that gets spent to prevent defeat and recovers 25% of your Health.",
        onBuy: (ns) => {
          ns.message = "You aquire a Healing Potion. It will be used automatically when needed."
          ns.potion++;
          return ns;
        },
      },
      {
        action: "Purchase Sword",
        cost: ((this.state.sword || 0) + 1) * 50,
        info: "Grants +1 Sword, which increases damage per round. Upkeep +" + 
          (this.state.sword) * 2 + ".",
        onBuy: (ns) => {
          ns.message = "You buy a new armor. Gain +1 Armor."
          ns.upkeep += ++ns.armor * 5;
          ns.hp = ns.hpMax += 2;
          return ns;
        },
      },
      {
        action: this.state.armor < 1 ? "Purchase Armor" : "Improve Armor",
        cost: ((this.state.armor || 0) + 1) * 200,
        info: "Grants +1 Armor, which prevents some damage per round, and +2 Health. Upkeep +" + 
          ((this.state.armor || 0) + 1) * 5 + ".",
        onBuy: (ns) => {
          ns.message = "You buy a new sword. Gain +1 Sword."
          ns.upkeep += ns.sword++ * 2;
          return ns;
        },
      },
      {
        action: this.state.mount < 1 ? "Purchase Mount" : "Train Mount",
        cost: ((this.state.mount || 0) + 1) * 500,
        info: "Skip rooms with " +  
          (this.state.mount ? this.state.mount + " encounters or less" : "no encounters") + 
          ". Reduced travel time. Upkeep +" + ((this.state.armor || 0) + 1) * 4 + ".",
        onBuy: (ns) => {
          ns.message = "You " + (ns.mount ? "train your " : "buy a new") + " mount.";
          ns.upkeep += ++ns.mount * 4;
          return ns;
        },
      },
      {
        action: "Improve Lifestyle",
        cost: ((this.state.regen * 100) ** 2),
        info: "Grants +0.5 Regen, and +1 Health per Level.",
        onBuy:  (ns) => {
          ns.message = "You improve your lifestyle, gain +0.5 Regen and +" + ns.lv + " Health";
          ns.regen += 0.5;
          ns.hpBonus++;
          ns.hpMax += ns.lv;
          return ns;
        }
      },
    ];
  }

  // Check if the player has enough gold (cash or banked) to make a purchase
  budget = (item) => {
    if (item.action == "Deposit Gold") {
      return item.cost <= this.state.gold;
    }
    return item.cost <= this.state.gold + this.state.bank;
  }

  // Perform a purchase from the marketplace by clicking an action button
  buy = (item) => {
    // Double check that the player has enough budget
    if (this.budget(item)) {
      this.setState((ns, props) => {
        ns.message = "";
        let message = "";

        // Exit the current dungeon if necessary
        // Multiple purchases strung together don't increase the day counter
        if (ns.floor > 0) {
          let days = this.travelTime(ns.floor + 1);
          ns.clicks += days; 
          ns.bank += this.calculateInterest(ns.bank, ns.interest, days);
          message += " You head out of the dungeon and back to town. Travel took " + days + " days";
          ns.floor = 0; ns.room = 0; ns.hp = ns.hpMax;
        }
        
        if (item.cost > ns.gold) {
          ns.bank = ns.bank - (item.cost - ns.gold); ns.gold = 0;
        } else {
          ns.gold -= item.cost;
        }

        // Render the message to the user
        ns = item.onBuy(ns);
        if (ns.message) { message += " " + ns.message; }
        ns.message = (
          <div>
            <h2>Day {ns.clicks}</h2>
            {message} 
          </div>
        );
        return ns;
      });
    }
  }
}

export default App;
