import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://192.168.10.10:8000/")
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
