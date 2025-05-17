"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/userSlice";
import Image from "next/image";
import styles from "./Login.module.css";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://cestprevu-backend.onrender.com/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    console.log("Réponse backend :", data);

    if (data.result) {
      dispatch(
        login({
          username: data.username,
          email: form.email,
          phone: form.phone,
          token: data.token,
          id: data.id,
        })
      );
      console.log("User connecté :", {
        username: data.username,
        email: form.email,
        phone: form.phone,
        token: data.token,
        id: data.id,
      });
      router.push("/account");
    } else {
      alert(data.error);
    }
  };
  
  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <>
      <header className="container mt-4">
        <div className="row align-items-center justify-content-between">
          <div className="col-auto">
            <Image
              src="/images/logo.svg"
              alt="Logo c'est prévu"
              width={200}
              height={200}
            />
          </div>

          <div
            className="col-auto"
            style={{ cursor: "pointer", display: "none" }}
          >
            <Image
              src="/images/account.svg"
              alt="Icône compte"
              width={50}
              height={50}
              className="compte"
            />
          </div>
        </div>
      </header>
      <div className={`container mt-4 ${styles.full}`}>
        <div className={`container mt-4 ${styles.form}`}>
          <form onSubmit={handleSubmit}>
            <div className={styles.title}>
              <h2>Connexion</h2>
            </div>
            <input
              className={`form-control mb-3 ${styles.input}`}
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              className={`form-control mb-3 ${styles.input}`}
              name="password"
              type="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />
            <div className={styles.centered}>
              <button
                type="submit"
                className={`mt-4 ${styles.button} ${styles.top}`}
              >
                Se connecter
              </button>
            </div>
          </form>
          <div className={`mt-4 ${styles.signin} ${styles.centered}`}>
            <p>
              Pas encore inscrit ?{" "}
              <span
                onClick={handleSignupClick}
                className={`mt-4 ${styles.link}`}
              >
                S'inscrire
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
