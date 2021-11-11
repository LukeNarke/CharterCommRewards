import React, { useState, useEffect } from "react";
import "./App.css";
// our simulated API call
import data from "./apiData";

function calculateRewards(price) {
  // between 50 and 100 must come first in the function
  // calculate rewards for purchases between 50 to 100
  if (price >= 50 && price < 100) {
    return price - 50;
    // VSCode IDE is messing up the equation, so need to hard core the rewards for $100 purchases
  } else if (price === 100) {
    return 50;
    // calculate rewards for purchases over 100
  } else if (price > 100) {
    return 2 * (price - 100) + 50;
  }
  return 0;
}

function App() {
  const [apiData, setAPIData] = useState({});
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [userRewards, setUserRewards] = useState({});
  const [userTransactions, setUserTransactions] = useState([]);

  // load data and user info only on the first render
  useEffect(() => {
    setAPIData({ ...data });
    setUsers([...Object.keys(data)]);
  }, []);

  // user selection dropdown style
  const userSelect = (value) => {
    setCurrentUser(value);
    let userData = apiData[value];

    let monthlyTotal = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };
    for (let i = 0; i < userData.length; i++) {
      let month = new Date(userData[i]["date"]);
      // how we get the correct month
      if (
        month.getMonth() + 1 === 1 ||
        month.getMonth() + 1 === 2 ||
        month.getMonth() + 1 === 3
      ) {
        // pushing amounts to help get the monthly total
        monthlyTotal[month.getMonth() + 1]["amounts"].push(
          userData[i]["amount"]
        );
      }
    }
    // calculate the monthly total
    for (let key in monthlyTotal) {
      let total_month_rewards = 0;
      for (let i = 0; i < monthlyTotal[key]["amounts"].length; i++) {
        let price = monthlyTotal[key]["amounts"][i];
        // calculate the reward amount
        total_month_rewards = total_month_rewards + calculateRewards(price);
      }
      // assign to the new monthly total
      monthlyTotal[key]["rewards"] = total_month_rewards;
    }
    // assigning the values we found
    setUserRewards({ ...monthlyTotal });
    setUserTransactions([...userData]);
  };

  return (
    <div
      style={{
        marginTop: "10px",
        marginBottom: "10px",
        fontSize: "30px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Reward Points Simulator</h2>
      <div style={{ textAlign: "center" }} className="select-style">
        <select
          // choose the user
          onChange={(e) => userSelect(e.target.value)}
          value={currentUser}
        >
          {/* start out as no user selected */}
          <option value="" disabled>
            Select User
          </option>
          {/* map through array of users for possible user choices */}
          {users.map((item, id) => {
            return (
              <option key={id} value={item}>
                {" "}
                {item.toUpperCase()}{" "}
              </option>
            );
          })}
        </select>
      </div>
      {/* using an object not an array, so use Object.keys instead of map */}
      {Object.keys(userRewards).length > 0 && (
        <div>
          <h4>Monthly Point Totals and Bottom-Line Total</h4>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JAN</td>
                <td>{userRewards[1]["rewards"]}</td>
              </tr>
              <tr>
                <td>FEB</td>
                <td>{userRewards[2]["rewards"]}</td>
              </tr>
              <tr>
                <td>MAR</td>
                <td>{userRewards[3]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>
                  {userRewards[1]["rewards"] +
                    userRewards[2]["rewards"] +
                    userRewards[3]["rewards"]}
                </td>
              </tr>
            </tbody>
          </table>
          <h4>User Transactions</h4>
          {userTransactions.length > 0 ? (
            <table className="customers">
              <thead>
                <tr>
                  <th>Date (MM/DD/YYYY)</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {/* transactions here are an array, so need to map */}
                {userTransactions.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>{item["date"]}</td>
                      <td>{item["amount"]}</td>
                      <td>{calculateRewards(item["amount"])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>No User History</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
