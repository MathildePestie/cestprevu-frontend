"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../component/Header";
import styles from "../participants.module.css";
import { useAppSelector } from "../../../redux/store";

export default function ParticipantsPage() {
  const { id } = useParams();
  const user = useAppSelector((state) => state.user);
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    fetch(`https://cestprevu-backend.onrender.com/lists/one/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
        }
      });
  }, [id]);

  if (!list) return <p>Chargement des participants...</p>;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2 className={styles.title}>
          Participants de la liste : {list.title}
        </h2>
        <ul className={styles.space}>
          <div className={styles.align}>
            <img
              className={styles.icon}
              alt="Créateur"
              src="/images/master.svg"
            />
            <span className={styles.createur}>
            <strong className={styles.label}>Créateur :</strong>
<span className={styles.username}>{list.owner.username}</span>

            </span>
          </div>
          <div className={styles.separator}></div>
          {list.members?.length > 0 ? (
            <>
              <h4 className={styles.membre}>Membres :</h4>
              {list.members.map((m: any) => (
                <li
                  className={`${styles.membreNom} ${styles.slideIn}`}
                  key={m._id}
                >
                  <img
                    className={styles.icon2}
                    src="/images/account.svg"
                    alt="membre"
                  />
                  <strong className={styles.respire}>{m.username}</strong> –{" "}
                  {list.membersCanEdit ? "peut modifier" : "lecture seule"}
                  {list.owner._id === user.id && (
                    <img
                      src="/images/cross.svg"
                      alt="Supprimer"
                      aria-label={`Supprimer ${m.username}`}
                      className={styles.removeIcon}
                      onClick={() => {
                        if (confirm(`Retirer ${m.username} de la liste ?`)) {
                          fetch(
                            `https://cestprevu-backend.onrender.com/lists/${list._id}/remove-member`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                token: user.token,
                                memberId: m._id,
                              }),
                            }
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.result) {
                                setList(data.list);
                              } else {
                                alert(
                                  data.error || "Erreur lors de la suppression."
                                );
                              }
                            });
                        }
                      }}
                    />
                  )}
                </li>
              ))}
            </>
          ) : (
            <p className={styles.membreNomN}>Pas encore de membres.</p>
          )}
        </ul>
        <button className={styles.backButton} onClick={() => history.back()}>
          Retour
        </button>
      </main>
    </>
  );
}
