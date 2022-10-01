import React, { useEffect, useCallback, useContext } from "react";
import { classes } from "./styles";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../../context/socket";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required(),
});

export const StudentInfo = () => {
  const { state } = useLocation();

  const socket = useContext(SocketContext);
  const navigate = useNavigate();

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

  const handleTeacherDisconnect = useCallback(() => {
    navigate("/", { state: "The teacher has disconnected. Please startover" });
  }, [navigate]);

  useEffect(() => {
    socket.on("check_for_teacher", checkIfTeacherAlreadyExists);
    socket.on("teacher_disconnected", handleTeacherDisconnect);

    return () => {
      socket.off("check_for_teacher");
      socket.off("teacher_disconnected");
    };
  }, [socket, checkIfTeacherAlreadyExists, handleTeacherDisconnect]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="grid h-screen place-items-center">
      <div className={clsx(classes.container())}>
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            navigate("/question");
          })}
        >
          <div className="mb-4">
            <p className="text-lg text-center text-slate-700">{state}</p>
            <label htmlFor="name" className={clsx(classes.fieldLabel())}>
              Name
            </label>
            <input
              id="name"
              placeholder="Enter your Full Name..."
              {...register("name")}
              className={clsx(classes.inputField())}
            />
            {errors.name && (
              <p className={clsx(classes.error())}>
                {capitalizeFirstLetter(errors.name.message)}
              </p>
            )}
          </div>
          <div className="text-center">
            <input
              type="submit"
              value="Continue"
              disabled={!isValid || isSubmitting}
              className={clsx(classes.button(!isValid || isSubmitting))}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentInfo;
