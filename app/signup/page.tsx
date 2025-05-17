"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/userSlice";
import Image from "next/image";
import styles from "../login/Login.module.css";

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const response = await fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.result) {
      dispatch(
        login({
          username: form.username,
          email: form.email,
          phone: form.phone,
          token: data.token,
          id: data.id,
        })
      );
      router.push("/account");
    } else {
      alert(data.error);
    }
  };

  const handleSigninClick = () => {
    router.push("/login");
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
              <h2>Inscription</h2>
            </div>
            <input
              className={`form-control mb-3 ${styles.input}`}
              name="username"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              required
            />
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
              name="phone"
              type="tel"
              placeholder="Téléphone"
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
            <input
              className={`form-control mb-3 ${styles.input}`}
              name="confirmPassword"
              type="password"
              placeholder="Confirmez le mot de passe"
              onChange={handleChange}
              required
            />
            <div className={styles.centered}>
            <button type="submit" className={`mt-4 ${styles.button} ${styles.top}`}>
              S'inscrire
            </button>
            </div>
          </form>
          <div className={`mt-4 ${styles.signin} ${styles.centered}`}>
            <p>
              Déjà inscrit ?{" "}
              <span
                onClick={handleSigninClick}
                className={`mt-4 ${styles.link}`}
              >
                Se connecter
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
