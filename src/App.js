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
        Your stats are shown below, keep an eye on them.
      </div>
    );  
    // The state of the App should hold all data that we are interested
    // in saving or loading across game sessions
    this.state = {
      ticks: 0,
      clicks: 0,
      message: initialMessage,
      // Game Resources start here
      gold: 100,
      lv: 1,
      xp: 0,
      hp: 12,
      hpMax: 12,
      sword: 2,
      armor: 0,
      lvFactor: 10,
      floor: 0,
      room: 0,
      rank: 1,
      regen: 0.25,
      resting: false,
      gems: 0
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
      let message = prevState.message;
      let clicks = prevState.clicks;

      // Apply HP regeneration
      const hpMax = prevState.hpMax;
      let hp = prevState.hp;
      let resting = prevState.resting;
      if (hp < hpMax) {
        hp += prevState.regen * (resting ? 10 : 1);
        if (hp >= hpMax) { 
          hp = hpMax; 
          if (resting) {
            resting = false;
            clicks++;
            message = (
              <div>
                <h2>Day {clicks}</h2>
                You wake up back in town with a headache. 
                After taking some time to rest you feel ready to continue your adventure. 
                Consider buying something from the Marketplace to ease your journey.
              </div>
            ); 
          }
        }
      }

      // Return the modified state after a tick
      return {
        ticks: prevState.ticks + 1,
        clicks: clicks,
        hp: hp,
        resting: resting,
        message: message
    }}); 
  }

  // Called every time the user clicks the Adventure! button, moves the game forward
  click = () => {
    this.setState((prevState, props) => {

      // Define all the things we are going to use to calculate state at the end
      let ns = {
        clicks: prevState.clicks + 1,
        message: "",
        xp: prevState.xp + 1, 
        lv: prevState.lv,
        hp: Math.floor(prevState.hp), 
        hpMax: prevState.hpMax,
        floor: prevState.floor,
        room: prevState.room,
        rank: prevState.rank,
        sword: prevState.sword,
        armor: prevState.armor,
        gold: prevState.gold,
        resting: false,
        gems: prevState.gems
      }

      // Determine the random encounter
      let encounterMessage;
      let reward = 0;
      if (ns.floor) {

        // Generate monsters for the encounter
        const monsterName = utils.getRandMonster();
        let monsterCount = Math.floor(Math.random() * (ns.floor + ns.rank));
        reward = monsterCount * ns.rank + ns.floor;
        let blocked = 0;
        let totalPlayerDamage = 0;

        if (monsterCount == 0) {
          encounterMessage = "No monsters on sight as you march on."
        } else {
          let rounds = 0;
          encounterMessage = "You encounter " + monsterCount + " " + monsterName + 
            (monsterCount > 1? "s" : "") + " and combat ensues!";

          // Simulate a fight between player and monsters
          // Every round, player takes up to 1 damage per Rank per monster
          // and at the same time the player kills 1 monster per point in their Sword stat
          while (monsterCount > 0 && ns.hp > 0) {
            let playerDamage = 1 + Math.floor(Math.random() * monsterCount * ns.rank) - ns.armor;
            let monsterDamage = 1 + Math.floor(Math.random() * ns.sword);
            if (playerDamage < 0) { playerDamage = 0; }
            totalPlayerDamage += playerDamage;
            ns.hp -= playerDamage;
            monsterCount -= monsterDamage;
            rounds++;
          }
          ns.xp += rounds; // Player gets +1 xp per round of battle
          encounterMessage += " Fought " + rounds + " round" + (rounds > 1 ? "s." : ".");
          if (totalPlayerDamage) {
            encounterMessage += " Took " + totalPlayerDamage + " damage."
          } 

          // Check the final result of the battle
          if (monsterCount <= 0 && ns.hp >= 1) {
            encounterMessage += " You are victorious! Found " + reward + " gold."
          }
        }

        // Check if the floor has been completed
        if (ns.room++ >= ns.floor) {
          ns.floor++; ns.room = 0;
          encounterMessage += " You find stairs leading down."
        }
      } else {
        // Message when entering the dungeon at first
        encounterMessage = "Before you stands the entrance to an ancient ruin."
        ns.floor++;
      }

      // Check if the player is too damaged to continue
      if (ns.hp < 1) {
        encounterMessage += " You are defeated. Monsters ran away with " + reward + " gold. You are unconcious."
        reward *= -1; ns.hp = 0; ns.floor = 0; ns.room = 0; ns.resting = true;
        if (ns.rank > 1) { 
          ns.rank <= 1;
          encounterMessage += " You've lost 1 Rank." 
        }
      } else {
        // Chance to find a gem if not unconcious 
        const gemsFound = Math.floor(Math.random() * ns.rank)
        if (gemsFound >= 1) {
          encounterMessage += " Found " + gemsFound + " gems!";
          ns.gems += gemsFound;
        }
      }

      // Apply reward (this is a penalty instead if the player died)
      ns.gold += reward;

      // Check for level up
      if (ns.xp >= prevState.lv * prevState.lvFactor ) { 
        ns.xp = 0; ns.lv++; ns.hpMax += 3; ns.hp += 3; ns.sword += 0.5; 
        encounterMessage += " You gained a Level!";
      } 

      // Prepare the message that will be rendered to the user
      ns.message = (
        <div>
          <h2>Day {this.state.clicks}</h2>
          You adventure. {encounterMessage}
        </div>
      );

      // Return the final computed state  
      return ns;
    }); 
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
        <div className="marketplace">
          <h3>Marketplace</h3>
          <table>
            <tr>
              <td>
                <button onClick={this.buy} disabled={this.state.resting} >Buy</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }

  // Render the resource indicators
  renderResources() {

    let armor;
    if (this.state.floor) { armor = <div>Armor +{this.state.armor}</div>; }
    let floor;
    if (this.state.floor) { 
      if (this.state.room) {
        floor = <div>Floor {this.state.floor}: Chamber {this.state.room}</div>;
      } else {
        floor = <div>Floor {this.state.floor}: Stairs</div>
      } 
    }
    let gems;
    if (this.state.gems > 0) { gems = <div>Gems {this.state.gems}</div>; }

    return (
      <div className="resources">
        <div>Level {this.state.lv} ({this.state.xp} / {this.state.lv * this.state.lvFactor})</div>
        <div>Rank {this.state.rank}</div>
        <div>Gold {utils.formatNum(this.state.gold)}</div>
        <div>Health {Math.floor(this.state.hp)} / {this.state.hpMax}</div>
        <div>Sword +{this.state.sword}</div>
        {armor}
        <div>Regen {this.state.regen}</div>
        {floor} {gems}
      </div>
    );
  }

  getMarketItems() {
    return {
      
    };
  }

}

export default App;
