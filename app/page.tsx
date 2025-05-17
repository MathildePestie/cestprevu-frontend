"use client";
import Image from "next/image";
import Header from "../component/Header";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/store"

export default function Home() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  const handleCreateList = () => {
    if (!user.isLoggedIn) {
      router.push("/login");
      return;
    } else {
      router.push("/listpage");
    }
  };

  return (
    <>
      <Header />
      <main
        className={`d-flex align-items-center justify-content-center ${styles.mainSection}`}
      >
        <div className="text-center">
          <h1 className={`fw-bold ${styles.title}`}>Bonjour,</h1>
          <p className={`mb-4 ${styles.subtitle}`}>
            Êtes-vous prêt à être prêt ?
          </p>
          <div>
            <Image
              src="/images/list.svg"
              alt="Illustration liste"
              width={200}
              height={200}
            />
          </div>
          <div className={`mt-4 ${styles.top}`}>
            <div
              className={`mt-4 ${styles.button} ${styles.top}`}
              onClick={handleCreateList}
            >
              Rédiger une nouvelle liste
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
