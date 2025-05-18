"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logout } from "../redux/userSlice";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleList = () => {
    router.push("/listpage");
  };

  const handleAccountClick = () => {
    if (user.isLoggedIn) {
      router.push("/account");
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="container mt-4">
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <Image
            onClick={handleHome}
            src="/images/logo.svg"
            className="logoHeader"
            alt="Logo c'est prévu"
            width={200}
            height={200}
          />
        </div>

        <div className="col-auto d-flex align-items-center gap-3">
          {user.isLoggedIn ? (
            <>
              <div className={styles.iconR}>
                <Image
                  onClick={handleList}
                  src="/images/list.svg"
                  alt="icône liste"
                  width={60}
                  height={60}
                  style={{
                    cursor: "pointer",
                    marginRight: "10%",
                  }}
                />
              </div>
              <div className={styles.icon}>
                <div
                  onClick={handleAccountClick}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={styles.icon}>
                <Image
                  src="/images/logout.svg"
                  alt="Déconnexion"
                  width={50}
                  height={50}
                  onClick={handleLogout}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                />
              </div>
            </>
          ) : (
            <div className={styles.icon}>
              <Image
                src="/images/account.svg"
                alt="Icône compte"
                width={50}
                height={50}
                onClick={handleAccountClick}
                className="compte"
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
