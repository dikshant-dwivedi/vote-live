import React, { useContext, useEffect, useCallback } from "react";
import { classes } from "./styles";
import clsx from "clsx";
import { SocketContext } from "../../context/socket";
import { useNavigate, useLocation } from "react-router-dom";

export const Home = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  const checkIfTeacherAlreadyExists = useCallback(
    (teacherExists) => {
      if (teacherExists) {
        navigate("/studentInfo", {
          state:
            "Since a teacher already exists in the connections, you are registered as a student persona.",
        });
      }
    },
    [navigate]
  );

  const registerAsTeacher = () => {
    socket.emit("register_as_teacher", () => {
      navigate("/questionForm");
    });
  };

  const handleTeacherRegister = useCallback(() => {
    navigate("/studentInfo", {
      state:
        "A teacher has already joined the connections, so you are registered as a student persona.",
    });
  }, [navigate]);

  useEffect(() => {
    socket.on("check_for_teacher", checkIfTeacherAlreadyExists);
    socket.on("teacher_registered", handleTeacherRegister);

    return () => {
      socket.off("check_for_teacher");
      socket.off("teacher_registered");
    };
  }, [socket, checkIfTeacherAlreadyExists, handleTeacherRegister]);

  return (
    <div className="grid h-screen place-items-center">
      <div className={clsx(classes.container())}>
        <div className={clsx(classes.heading())}>
          <p className="text-lg text-center text-slate-700">{state}</p>
          <h1>What type of a user are you?</h1>
        </div>
        <div className="grid grid-col-2 grid-flow-col gap-4">
          <div className="text-center">
            <button
              className={clsx(classes.button())}
              onClick={() => navigate("/studentInfo")}
            >
              Student
            </button>
          </div>
          <div className="text-center">
            <button
              className={clsx(classes.button())}
              onClick={() => registerAsTeacher()}
            >
              Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
