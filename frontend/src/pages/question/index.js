import React, { useState, useEffect, useCallback, useContext } from "react";
import { classes } from "./styles";
import clsx from "clsx";
import { SocketContext } from "../../context/socket";
import { useNavigate } from "react-router-dom";

/*const question = {
  question: "Waterloo Counselling Services provides workshops about:",
  options: [
    { value: "cooking skills" },
    { value: "hockey refereeing" },
    { value: "study skills" },
    { value: "fire safety and prevention" },
  ],
};*/

export const Question = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [question, setQuestion] = useState(null);

  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const checkIfTeacherAlreadyExists = useCallback(
    (teacherExists) => {
      if (teacherExists && teacherExists === socket.id) {
        navigate("/questionForm", {
          state:
            "Since you're connected as a student, please fill the question here",
        });
      } else if (!teacherExists) {
        navigate("/", {
          state:
            "The poll is either over or teacher has disconnected. Please start over.",
        });
      }
    },
    [navigate, socket.id]
  );

  const handleAnswerPoll = useCallback((data) => {
    setQuestion(data);
  }, []);

  const handleTeacherDisconnect = useCallback(() => {
    navigate("/", { state: "The teacher has disconnected. Please startover" });
  }, [navigate]);

  const castVote = (selection) => {
    socket.emit("cast_vote", selection, () => {
      let q = question;
      q.options = q.options.map((i) => {
        if (i.value === selection) {
          i.votes++;
        }
        return i;
      });
      navigate("/pollingResult", { state: q });
    });
  };

  useEffect(() => {
    socket.on("check_for_teacher", checkIfTeacherAlreadyExists);
    socket.on("teacher_disconnected", handleTeacherDisconnect);
    socket.on("answer_question", handleAnswerPoll);
    socket.on("send_question_to_student", handleAnswerPoll);

    return () => {
      socket.off("check_for_teacher");
      socket.off("teacher_disconnected");
      socket.off("answer_question");
      socket.off("send_question_to_student");
      setQuestion(null);
    };
  }, [
    socket,
    checkIfTeacherAlreadyExists,
    handleTeacherDisconnect,
    handleAnswerPoll,
  ]);

  useEffect(() => {
    socket.emit("send_question");
  }, [socket]);

  if (!question) {
    return (
      <div className="grid h-screen place-items-center">
        <div className={clsx(classes.waitingForQuestion())}>
          <h1>Waiting for teacher to ask the question...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen place-items-center">
      <div className={clsx(classes.container())}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            castVote(selectedOption);
          }}
        >
          <div className={clsx(classes.title())}>
            <h1>Select the correct answer and submit</h1>
          </div>
          <div className={clsx(classes.heading())}>
            <h1>{question.question}</h1>
          </div>
          <div className={clsx(classes.optionContainer())}>
            {question?.options?.map((op, i) => (
              <div key={i}>
                <input
                  type="radio"
                  checked={selectedOption === op.value}
                  onChange={() => setSelectedOption(op.value)}
                  className="mr-2 h-4 w-4"
                />
                <label>{op.value}</label>
              </div>
            ))}
          </div>
          <div>
            <input
              type="submit"
              disabled={!selectedOption}
              className={clsx(classes.button(!selectedOption))}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Question;
