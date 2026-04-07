import { useState } from "react";
import { addUser } from "../services/api";

function AddUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(user);
    alert("User Added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name"
        onChange={e => setUser({...user, name: e.target.value})} />

      <input placeholder="Email"
        onChange={e => setUser({...user, email: e.target.value})} />

      <input placeholder="Password"
        onChange={e => setUser({...user, password: e.target.value})} />

      <button type="submit">Add</button>
    </form>
  );
}

export default AddUser;