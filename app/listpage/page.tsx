"use client";
import Header from "../../component/Header";
import { useAppSelector } from "../../redux/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./listpage.module.css";

export default function Listpage() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateList = async () => {
    const response = await fetch("https://cestprevu-backend.onrender.com/lists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        title,
        description,
        tasks: [],
      }),
    });
  
    const data = await response.json();
  
    // 🛡️ On vérifie que l'ID est bien présent et la liste valide
    if (data.result && data.list && data.list._id) {
      // 👇 Nouveau ! attendre 500ms pour être sûr que Mongo a bien "répliqué"
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      setTitle("");
      setDescription("");
      router.push(`/listpage/${data.list._id}`);
    } else {
      alert("Erreur lors de la création de la liste : " + data.error);
    }
  };

  return (
    <>
      <Header />
      <main className={`row align-items-center`}>
        <div className={`row align-items-center ${styles.all}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateList();
            }}
            className={styles.full}
          >
            <h4 className={`fw-bold mb-3 ${styles.title}`}>Création de votre liste</h4>
            <input
              type="text"
              placeholder="Titre de la liste"
              className={`form-control mb-2 ${styles.input}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className={`form-control mb-2 ${styles.input}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles.center}>
            <button
              type="submit"
              className={styles.button}
            >
              Créer ma liste
            </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
