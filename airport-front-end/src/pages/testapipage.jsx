import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://flysy.software/")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Lista de usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            ID: {user.id} Email:{user.email}
            </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
