"use client";
import { useEffect, useState } from "react";
import Header from "../../component/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ListCard from "../../component/ListCard";
import EditProfileModal from "../../component/EditProfileModal";
import styles from "./account.module.css";
import { useAppSelector } from "../../redux/store";

export default function AccountPage() {
  const user = useAppSelector((state) => state.user);
  const [lists, setLists] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user.id) {
      console.warn("⚠️ ID utilisateur manquant !");
      return;
    }
    console.log("Je vais fetch les listes de :", user.id);
    fetch(`https://cestprevu-backend.onrender.com/lists/${user.id}`)
      .then((res) => res.json())
      .then((listsData) => {
        if (listsData.result) setLists(listsData.lists);
        console.log("Listes reçues:", listsData.lists);
      });
  }, [user.token]);

  const handleDelete = async (id: string) => {
    const res = await fetch(
      `https://cestprevu-backend.onrender.com/lists/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    if (data.result) {
      setLists(lists.filter((l) => l._id !== id));
    }
  };
  console.log(user);

  return (
    <>
      <Header />
      <main className="container mt-5">
        <div
          className={`d-flex flex-wrap flex-md-nowrap flex-column-reverse flex-md-row gap-4`}
        >
          {/* Bloc gauche = Listes */}
          <div className="col-md-8">
            <h4 className={`fw-bold mb-3 ${styles.title}`}>Mes listes</h4>
            {lists.length > 0 ? (
              lists.map((list) => (
                <ListCard
                  key={list._id}
                  title={list.title}
                  creator={list.owner?.username || "Inconnu"}
                  createdAt={list.createdAt}
                  isShared={list.owner?._id !== user.id}
                  onDelete={
                    list.owner?._id === user.id
                      ? () => handleDelete(list._id)
                      : undefined
                  }
                  onEdit={() => {}}
                  onView={() => router.push(`/listpage/${list._id}`)}
                />
              ))
            ) : (
              <p className={styles.none}>Tu n’as pas encore créé de liste</p>
            )}
          </div>

          {/* Bloc droit = Profil */}
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm">
              <h4 className={styles.infoT}>Mon profil</h4>
              <p className={styles.info}>
                <strong>Pseudo :</strong> {user.username}
              </p>
              <p className={styles.info}>
                <strong>Email :</strong> {user.email}
              </p>
              <p className={styles.info}>
                <strong>Téléphone :</strong> {user.phone}
              </p>
              <div className={styles.button}>
                <Image
                  width={50}
                  height={50}
                  src="/images/edit.svg"
                  alt="modifier"
                  onClick={() => setShowEditModal(true)}
                />
              </div>
            </div>
          </div>
        </div>
        <EditProfileModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onUpdate={(updatedUser) => {
            // tu peux mettre à jour le store Redux ici si tu veux
            console.log("Mise à jour utilisateur :", updatedUser);
          }}
        />
      </main>
    </>
  );
}
