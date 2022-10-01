import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { classes } from "./styles";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socket";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/*const question = {
  question: "Waterloo Counselling Services provides workshops about:",
  options: [
    { value: "cooking skills", number: 45 },
    { value: "hockey refereeing", number: 17 },
    { value: "study skills", number: 89 },
    { value: "fire safety and prevention", number: 123 },
  ],
};*/

ChartJS.defaults.color = "#1e293b";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Live Polling Result",
    },
    labels: {
      render: "percentage",
      precision: 2,
    },
  },
  scales: {
    x: {
      grid: {
        borderColor: "#1e293b",
        color: "#1e293b",
      },
    },
    y: {
      grid: {
        borderColor: "#1e293b",
        color: "#1e293b",
      },
    },
  },
};

export const PollingResult = () => {
  const { state } = useLocation();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [qData, setQData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(68, 175, 105)",
          "rgba(248, 51, 60)",
          "rgba(43, 158, 179)",
          "rgba(102, 119, 97)",
          "rgba(183, 148, 146)",
        ],
        borderColor: "#1e293b",
        borderWidth: 1,
      },
    ],
  });
  const [isATeacher, setIsATeacher] = useState(false);

  const checkIfTeacherAlreadyExists = useCallback(
    (teacherExists) => {
      if (!teacherExists) {
        navigate("/", {
          state:
            "The poll is either over or teacher has disconnected. Please start over.",
        });
      } else if (teacherExists && teacherExists === socket.id) {
        setIsATeacher(true);
      }
      console.log(teacherExists);
    },
    [navigate, socket.id]
  );

  const updatePollingResult = useCallback(
    (question) => {
      let data = structuredClone(qData);
      data.labels = question.options.map((o) => o.value);
      data.datasets[0].label = question.question;
      data.datasets[0].data = question.options.map((o) => o.votes);
      setQData(data);
    },
    [qData]
  );

  useEffect(() => {
    socket.on("check_for_teacher", checkIfTeacherAlreadyExists);

    return () => {
      socket.off("check_for_teacher");
    };
  }, [socket, checkIfTeacherAlreadyExists]);

  useEffect(() => {
    socket.emit("check_for_teacher");
  }, [socket]);

  useEffect(() => {
    socket.on("update_poll_result", updatePollingResult);

    if (state) {
      if (qData.labels.length === 0) {
        const question = state;
        let data = qData;
        data.labels = question.options.map((o) => o.value);
        data.datasets[0].label = question.question;
        data.datasets[0].data = question.options.map((o) => o.votes);
        setQData(data);
      }
    } else {
      navigate("/", "Poll data not available. Please startover.");
    }

    return () => {
      socket.off("update_poll_result");
    };
  }, [state, navigate, qData, socket, updatePollingResult]);

  useEffect(() => {
    socket.on("update_poll_result", updatePollingResult);

    return () => {
      socket.off("update_poll_result");
    };
  }, [qData, socket, updatePollingResult]);

  return (
    <div className="grid h-screen place-items-center">
      <div className={clsx(classes.container())}>
        <Bar options={options} data={qData} />
        {isATeacher ? (
          <button
            className={clsx(classes.button())}
            onClick={() => navigate("/questionForm")}
          >
            Ask another question...
          </button>
        ) : (
          <button
            className={clsx(classes.button())}
            onClick={() => navigate("/question")}
          >
            Wait for another question...
          </button>
        )}
      </div>
    </div>
  );
};

export default PollingResult;
