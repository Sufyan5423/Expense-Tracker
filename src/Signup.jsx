import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/signup", { name, email, password });

      if (res.data.success) {
        alert("Signup successful! Please login.");
        navigate("/"); // go to login page
      } else {
        alert(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
      <p>
        Already have an account? <span onClick={() => navigate("/")} style={{color:"blue", cursor:"pointer"}}>Login</span>
      </p>
    </div>
  );
}
