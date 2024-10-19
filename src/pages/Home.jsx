// Home.js
import React from "react"

const Home = ({ user }) => {
  console.log(user)
  return user ? (
    <h3>hello</h3>
  ) : (
    <h3>Oops! You must be signed in to do that!</h3>
  )
}

export default Home
