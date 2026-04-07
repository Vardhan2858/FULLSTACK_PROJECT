import { useEffect, useState } from "react";
import { getUsers } from "../services/api";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <p key={u.id}>{u.name} - {u.email}</p>
      ))}
    </div>
  );
}

export default Home;