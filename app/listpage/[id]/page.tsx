"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../component/Header";
import MobileDrawer from "../../../component/MobileDrawer";
import useIsMobile from "../../../hooks/useIsMobile";
import styles from "../id.module.css";
import Image from "next/image";
import { useAppSelector } from "../../../redux/store";
import { notFound } from "next/navigation";
import { io } from "socket.io-client";
const socket = io("https://cestprevu-backend.onrender.com");

export default function ListDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [list, setList] = useState<any>(null);
  const [taskText, setTaskText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const user = useAppSelector((state) => state.user);
  const [emailMember, setEmailMember] = useState("");
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [membersCanEdit, setMembersCanEdit] = useState(false);

  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    const handleListUpdate = (updatedList: any) => {
      if (updatedList.deleted) {
        alert("Cette liste a été supprimée.");
        router.push("/");
      } else {
        setList(updatedList);
      }
    };

    socket.on("listUpdated", handleListUpdate);

    return () => {
      socket.emit("leaveRoom", id);
      socket.off("listUpdated", handleListUpdate);
    };
  }, [id]);

  useEffect(() => {
    if (!id) {
      console.warn("⚠️ ID introuvable !");
      return;
    }

    fetch(`https://cestprevu-backend.onrender.com/lists/one/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || typeof data !== "object") {
          console.warn("🧨 Données invalides");
          return notFound();
        }

        if (data.result && data.list && data.list.title) {
          setList(data.list);
          setEditTitle(data.list.title);
          setEditDescription(data.list.description);
          setMembersCanEdit(data.list.membersCanEdit);
        } else {
          console.warn("⚠️ Données incomplètes :", data);
          notFound();
        }
      })
      .catch((err) => {
        console.error("🔴 Erreur lors du fetch :", err);
        notFound();
      });
  }, [id]);

  const handleToggleTask = (index: number) => {
    fetch(
      `https://cestprevu-backend.onrender.com/lists/${list._id}/toggle-task/${index}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.token }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
        } else {
          alert("Erreur lors du changement d'état de la tâche.");
        }
      });
  };

  const handleDeleteTask = (index: number) => {
    if (!canEdit)
      return alert("Tu n'as pas les droits pour modifier cette liste.");
    const updatedTasks = [...list.tasks];
    updatedTasks.splice(index, 1);

    fetch(`https://cestprevu-backend.onrender.com/lists/${list._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedTasks, token: user.token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
        } else {
          alert("Erreur lors de la suppression de la tâche.");
        }
      });
  };

  const handleUpdateList = () => {
    if (!canEdit)
      return alert("Tu n'as pas les droits pour modifier cette liste.");
    fetch(`https://cestprevu-backend.onrender.com/lists/${list._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        token: user.token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
          setEditMode(false);
        } else {
          alert("Erreur lors de la modification de la liste.");
        }
      });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim() || !canEdit) return;

    const newTask = { text: taskText.trim(), done: false };
    const updatedTasks = [...list.tasks, newTask];

    fetch(`https://cestprevu-backend.onrender.com/lists/${list._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedTasks, token: user.token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
          setTaskText("");
        } else {
          alert("Erreur lors de l’ajout de la tâche.");
        }
      });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailMember.trim() || !isOwner) return;

    fetch(
      `https://cestprevu-backend.onrender.com/lists/${list._id}/add-member`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.token, email: emailMember }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          alert("Membre ajouté !");
          setEmailMember("");
        } else {
          alert(data.error || "Erreur lors de l’ajout du membre.");
        }
      });
  };

  const handleToggleMembersCanEdit = () => {
    fetch(`https://cestprevu-backend.onrender.com/lists/${list._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membersCanEdit: !list.membersCanEdit,
        token: user.token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setList(data.list);
        } else {
          alert("Erreur lors du changement des droits.");
        }
      });
  };

  const [phoneMember, setPhoneMember] = useState("");

  const handleAddMemberByEmail = () => {
    if (!emailMember.trim()) return;
    fetch(
      `https://cestprevu-backend.onrender.com/lists/${list._id}/add-member`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.token, email: emailMember }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          alert("Membre ajouté par email !");
          setEmailMember("");
        } else {
          alert(data.error || "Erreur ajout email.");
        }
      });
  };

  const handleAddMemberByPhone = () => {
    if (!phoneMember.trim()) return;
    fetch(
      `https://cestprevu-backend.onrender.com/lists/${list._id}/add-member-phone`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.token, phone: phoneMember }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          alert("Membre ajouté par téléphone !");
          setPhoneMember("");
        } else {
          alert(data.error || "Erreur ajout téléphone.");
        }
      });
  };

  if (!list) {
    return (
      <>
        <Header />
        <main className={`container mt-5 ${styles.listDetail}`}>
          <h2>Chargement en cours...</h2>
        </main>
      </>
    );
  }
  const isOwner = list.owner?._id === user.id;
  const isMember = list.members?.some((member: any) => member._id === user.id);
  const canEdit = isOwner || (isMember && membersCanEdit);

  return (
    <>
      <Header />
      <main className={`container mt-5`}>
        <div className={styles.listDetail}>
          {/* Colonne gauche */}
          <div className={styles.tasksColumn}>
            {isMobile && (
              <div className={styles.mobileOptionsWrapper}>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className={styles.optionsButton}
                >
                  Options
                </button>
              </div>
            )}

            <div className={styles.headerRow}>
              <div className={styles.avatar}>
                {list.owner?.username
                  ? list.owner.username.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <h2 className={styles.title}>{list.title}</h2>
            </div>

            <p className={styles.description}>{list.description}</p>
            <div className={styles.seeParticipants}>
              <img
                className={styles.participants}
                src="/images/account.svg"
                alt="participants"
                onClick={() => router.push(`/participants/${list._id}`)}
              />
              <p className={styles.texte}>Voir les participants</p>
            </div>

            <h4 className={styles.titre}>Tâches</h4>
            {list.tasks?.length > 0 ? (
              <ul className="list-group mt-2">
                {list.tasks.map((task: any, index: number) => (
                  <li key={index} className={styles.taskItem}>
                    <div className={styles.row}>
                      <input
                        type="checkbox"
                        className={styles.taskCheckbox}
                        checked={task.done}
                        onChange={() => handleToggleTask(index)}
                      />
                      <span className={task.done ? styles.taskDone : ""}>
                        {task.text}
                      </span>
                      {task.done && task.doneBy && (
                        <p className={styles.whoDidIt}>
                          {task.doneBy.username} l'a fait !
                        </p>
                      )}
                    </div>
                    {canEdit && (
                      <div className={styles.cross}>
                        <Image
                          src="/images/cross.svg"
                          alt="Supprimer"
                          width={20}
                          height={20}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteTask(index)}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mt-2">Aucune tâche pour le moment.</p>
            )}
          </div>

          {/* Colonne droite */}
          {!isMobile && (
            <div className={styles.sidebar}>
              <h5 className={styles.possible}>Modifier la liste</h5>
              {editMode ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="form-control mb-2"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className={styles.align}>
                    <button
                      className={styles.saveButton}
                      onClick={handleUpdateList}
                    >
                      Sauvegarder
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setEditMode(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.right}>
                  <button
                    className={styles.saveButton2}
                    onClick={() => setEditMode(true)}
                  >
                    Modifier la liste
                  </button>
                </div>
              )}

              <hr className="my-4" />

              {canEdit && (
                <>
                  <h5 className={styles.possible}>Ajouter une tâche</h5>
                  <form onSubmit={handleAddTask}>
                    <div className={styles.first}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Nouvelle tâche"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                      />
                      <button type="submit" className={styles.saveButton2}>
                        Ajouter
                      </button>
                    </div>
                  </form>
                </>
              )}
              <hr className="my-4" />
              <h5 className={styles.possible}>Ajouter un membre</h5>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!list._id || !emailMember.trim()) return;

                  fetch(
                    `https://cestprevu-backend.onrender.com/lists/${list._id}/add-member`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        token: user.token,
                        email: emailMember,
                      }),
                    }
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.result) {
                        alert("Membre ajouté !");
                        setEmailMember("");
                      } else {
                        alert(
                          data.error || "Erreur lors de l’ajout du membre."
                        );
                      }
                    });
                }}
              >
                <div className={styles.second}>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="Email du membre"
                    value={emailMember}
                    onChange={(e) => setEmailMember(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.saveButton3}
                    onClick={handleAddMemberByEmail}
                  >
                    Par email
                  </button>
                </div>
                <div className={styles.second}>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="Téléphone du membre"
                    value={phoneMember}
                    onChange={(e) => setPhoneMember(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.saveButton3}
                    onClick={handleAddMemberByPhone}
                  >
                    Par téléphone
                  </button>
                </div>
              </form>

              {list.owner?._id === user.id && (
                <>
                  <hr className="my-4" />
                  {isOwner && (
                    <>
                      <h5 className={styles.possible}>Droits des membres</h5>
                      <div className={styles.toggleWrapper}>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={membersCanEdit}
                            onChange={() => {
                              const newValue = !membersCanEdit;
                              setMembersCanEdit(newValue);

                              fetch(
                                `https://cestprevu-backend.onrender.com/lists/${list._id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    membersCanEdit: newValue,
                                    token: user.token,
                                  }),
                                }
                              )
                                .then((res) => res.json())
                                .then((data) => {
                                  if (data.result) {
                                    setList(data.list);
                                  } else {
                                    alert(
                                      "Erreur lors du changement des droits."
                                    );
                                    setMembersCanEdit(!newValue);
                                  }
                                });
                            }}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={styles.toggleLabel}>
                          {membersCanEdit ? "Oui" : "Non"}
                        </span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={list.title}
        description={list.description}
        onEdit={() => {
          setEditMode(true);
          setIsDrawerOpen(false);
        }}
        onAddMemberByEmail={handleAddMemberByEmail}
        onAddMemberByPhone={handleAddMemberByPhone}
        emailMember={emailMember}
        setEmailMember={setEmailMember}
        phoneMember={phoneMember}
        setPhoneMember={setPhoneMember}
        membersCanEdit={membersCanEdit}
        toggleMembersCanEdit={handleToggleMembersCanEdit}
        isOwner={isOwner}
        onAddTask={handleAddTask}
        taskText={taskText}
        setTaskText={setTaskText}
        canEdit={canEdit}
      />
    </>
  );
}
