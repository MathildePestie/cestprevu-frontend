// components/MobileDrawer.js
"use client";

import { useEffect } from "react";
import styles from "./MobileDrawer.module.css";
import Image from "next/image";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onEdit: () => void;
  onAddMemberByEmail: () => void;
  onAddMemberByPhone: () => void;
  emailMember: string;
  setEmailMember: (value: string) => void;
  phoneMember: string;
  setPhoneMember: (value: string) => void;
  membersCanEdit: boolean;
  toggleMembersCanEdit: () => void;
  isOwner: boolean;
  onAddTask: (e: React.FormEvent) => void;
  taskText: string;
  setTaskText: (value: string) => void;
  canEdit: boolean;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  title,
  description,
  onEdit,
  onAddMemberByEmail,
  onAddMemberByPhone,
  emailMember,
  setEmailMember,
  phoneMember,
  setPhoneMember,
  membersCanEdit,
  toggleMembersCanEdit,
  isOwner,
  onAddTask,
  taskText,
  setTaskText,
  canEdit,
}: MobileDrawerProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <Image
              src="/images/cross.svg"
              width={20}
              height={20}
              alt="Fermer"
            />
          </button>
        </div>
        <p className={styles.description}>{description}</p>

        {isOwner && (
          <>
            <button onClick={onEdit} className={styles.actionButton}>
              Modifier la liste
            </button>

            <div className={styles.toggleWrapper}>
              <span>Droits de modification :</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={membersCanEdit}
                  onChange={toggleMembersCanEdit}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email du membre"
                value={emailMember}
                onChange={(e) => setEmailMember(e.target.value)}
              />
              <button
                onClick={onAddMemberByEmail}
                className={styles.secondaryButton}
              >
                Ajouter par email
              </button>
            </div>

            <div className={styles.formGroup}>
              <input
                type="tel"
                placeholder="Téléphone du membre"
                value={phoneMember}
                onChange={(e) => setPhoneMember(e.target.value)}
              />
              <button
                onClick={onAddMemberByPhone}
                className={styles.secondaryButton}
              >
                Ajouter par téléphone
              </button>
            </div>
          </>
        )}
        {canEdit && (
          <>
            <h5 className={styles.possible}>Ajouter une tâche</h5>
            <form onSubmit={onAddTask}>
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
      </div>
    </div>
  );
}
