import { useEffect, useContext, useState } from "react";
import context from "../context";
import swal from "sweetalert";
import Swal from "sweetalert2";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function Navbar() {
  const contextNav = useContext(context);
  const [side, setSide] = useState(() => {
    const localSide = JSON.parse(localStorage.getItem("side"));
    return localSide ? localSide : false;
  });

  const [fullName, setFullName] = useState(() => {
    const localFullName = JSON.parse(localStorage.getItem("fullName"));
    return localFullName ? localFullName : "";
  });
  const [email, setEmail] = useState(() => {
    const localEmail = JSON.parse(localStorage.getItem("email"));
    return localEmail ? localEmail : "";
  });
  const [profile, setProfile] = useState(() => {
    const localProfile = JSON.parse(localStorage.getItem("profile"));
    return localProfile ? localProfile : "";
  });
  const [sign, setSign] = useState(() => {
    const localSign = JSON.parse(localStorage.getItem("sign"));
    return localSign ? localSign : false;
  });

  useEffect(() => {
    if (contextNav.them === "sun") {
      document.documentElement.style.setProperty("--text-color", "#0C2D57");
      document.documentElement.style.setProperty("--first-color", "#EFECEC");
      document.documentElement.style.setProperty("--second-color", "#FFB0B0");
      document.documentElement.style.setProperty("--third-color", "#FC6736");
    } else {
      document.documentElement.style.setProperty("--text-color", "#B6EADA");
      document.documentElement.style.setProperty("--first-color", "#03001C");
      document.documentElement.style.setProperty("--second-color", "#301E67");
      document.documentElement.style.setProperty("--third-color", "#5B8FB9");
    }
  }, [contextNav.them]);

  useEffect(() => {
    localStorage.setItem("fullName", JSON.stringify(fullName));
  }, [fullName]);
  useEffect(() => {
    localStorage.setItem("email", JSON.stringify(email));
  }, [email]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("sign", JSON.stringify(sign));
  }, [sign]);

  useEffect(() => {
    localStorage.setItem("side", JSON.stringify(side));
  }, [side]);

  const editProfileHandler = async () => {
    swal({
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your Full name",
          type: "text",
        },
      },
      buttons: true,
    }).then(async (res) => {
      if (res) {
        setFullName(res);
        const { value: file } = await Swal.fire({
          title: "Select image",
          input: "file",
          inputAttributes: {
            accept: "image/*",
            "aria-label": "Upload your profile picture",
          },

          button: false,
        });

        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const uploadedImageURL = e.target.result;

            setProfile(uploadedImageURL);
          };
          reader.readAsDataURL(file);
        }
      }
    });
  };

  const signHandler = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Sign up",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Type your full name">
        <input id="swal-input2" class="swal2-input" placeholder="Type your email">
      `,
      focusConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (emailRegex.test(formValues[1])) {
      setFullName(formValues[0]);
      setEmail(formValues[1]);
      setSign(true);
      swal({
        icon: "success",
        text: "Sign up complete successfully",
        timer: 1500,
        buttons: false,
      });
    } else {
      if (!formValues[0].trim() || !formValues[1].trim()) {
        swal({
          icon: "warning",
          text: "Please fill both of inputs",
        });
      } else {
        swal({
          icon: "error",
          title: "Email Error",
          text: "Please write correct email address",
        });
      }
    }
  };

  const logoutHandler = async () => {
    swal({
      icon: "warning",
      title: "Log out",
      text: "Are you sure to log out the site",
      buttons: true,
    }).then(async (res) => {
      if (res) {
        contextNav.setAllTodo([]);
        setSign(false);
        setSide(false);
        setFullName("");
        setEmail("");
        setProfile("");
        contextNav.setPercentProgress(0)
      }
    });
  };

  return (
    <>
      <div className={side ? "shad sideBar sideBarActive" : "shad sideBar"}>
        <div
          style={{
            background: `url(${
              profile ? profile : "/images/profile.svg"
            })`,
          }}
          className="sideBar__profile image shad"
        ></div>
        <p className="sideBar__userName">{fullName && fullName}</p>
        <div className="sideBar__process">
          <p className="sideBar__process__percent">
            {contextNav.percentProgres && !isNaN(contextNav.percentProgres)
              ? contextNav.percentProgres
              : 0}
            %
          </p>
          <p className="sideBar__process__percentDetails">
            The percentage of completion todoes
          </p>
        </div>

        <div onClick={editProfileHandler} className="editProfile">
          Edit Profiler
        </div>
        <img
          onClick={logoutHandler}
          className="image logout"
          src="/images/logout.svg"
          alt="logout button"
        />
      </div>

      <div className="navbar shad">
        <div
          onClick={() =>
            contextNav.setThem((p) => {
              if (p === "sun") {
                p = "moon";
              } else {
                p = "sun";
              }
              return p;
            })
          }
          className="navbar__themBtn"
        >
          <img
            src={
              contextNav.them !== "sun"
                ? "/images/sun.svg"
                : "/images/moon.svg"
            }
            alt="them changer"
          />
        </div>
        {sign ? (
          <>
            <div
              onClick={() => setSide((p) => (p = !p))}
              className="navbar__profile"
            >
              <img src="/images/profile.svg" alt="profile" />
            </div>
          </>
        ) : (
          <div onClick={signHandler} className="navbar__profile">
            <img src="/images/sign.svg" alt="profile" />
          </div>
        )}
      </div>
    </>
  );
}
