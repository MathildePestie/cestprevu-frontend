"use client";

import { FC, useState } from "react";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/navigation";
import styles from "./ListCard.module.css";

type ListProps = {
  title: string;
  creator: string;
  createdAt: string;
  isShared?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
};

const ListCard: FC<ListProps> = ({
  title,
  creator,
  createdAt,
  isShared,
  onDelete,
  onEdit,
  onView,
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => setShowModal(true);
  const handleConfirmDelete = () => {
    onDelete?.();
    setShowModal(false);
  };

  return (
    <>
      <div className={`card mb-3 ${styles.card}`}>
        <div className="card-body">
        <div className={styles.flex}>{!isShared && <img className={styles.badge} alt="Éditeur" src="/images/master.svg"/>}</div>
          <h5 className={styles.title}>{title}</h5>
          <p className={styles.info}>
            <strong>Créée par :</strong> {creator}
          </p>
          <p className={styles.info}>
            <strong>Date :</strong> {new Date(createdAt).toLocaleDateString()}
          </p>

          <div className={styles.actions}>
            <button className={styles.button} onClick={onView ?? (() => {})}>
              Voir
            </button>
            <button className={styles.button} onClick={onEdit}>
              Modifier
            </button>
            <button className={styles.button} onClick={handleDeleteClick}>
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <DeleteModal
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title={title}
      />
    </>
  );
};

export default ListCard;
