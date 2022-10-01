import React, { useContext, useEffect, useCallback } from "react";
import { classes } from "./styles";
import clsx from "clsx";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SocketContext } from "../../context/socket";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

const schema = yup.object().shape({
  question: yup
    .string()
    .max(255, "Question length must not exceed more than 255 characters")
    .required(),
  options: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          id: yup.string().required(),
          value: yup
            .string()
            .required("Option field is required")
            .max(255, "Option length must not exceed more than 255 characters"),
          isCorrect: yup.boolean().required(),
          votes: yup.number().required(),
        })
        .required()
    )
    .min(2)
    .max(6),
});

const formOptions = { resolver: yupResolver(schema) };

export const QuestionForm = () => {
  const { register, control, handleSubmit, reset, formState, watch } =
    useForm(formOptions);
  const { errors, isValid, isSubmitting } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const options = watch("options");

  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const checkIfTeacherAlreadyExists = useCallback(
    (teacherExists) => {
      if (!teacherExists || teacherExists !== socket.id) {
        navigate("/studentInfo", {
          state:
            "You are not authorized to form questions. Please wait for the teacher to form question",
        });
      }
    },
    [navigate, socket.id]
  );

  const askQuestion = (data) => {
    socket.emit("ask_question", data, () => {
      navigate("/pollingResult", { state: data });
    });
  };

  useEffect(() => {
    socket.on("check_for_teacher", checkIfTeacherAlreadyExists);

    return () => {
      socket.off("check_for_teacher");
    };
  }, [socket, checkIfTeacherAlreadyExists]);

  const checkOptionErrors = () => {
    let errorList = [];
    if (options?.length < 2) {
      errorList.push("Atleast two options are required");
    }
    if (options?.filter((i) => i.isCorrect === true).length !== 1) {
      errorList.push("Atleast and only one option needs to be correct");
    }
    return errorList;
  };

  const optionErrorsList = checkOptionErrors();

  return (
    <div className="grid h-screen place-items-center">
      <div className={clsx(classes.container())}>
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            askQuestion(data);
          })}
        >
          <div>
            <label htmlFor="question" className={clsx(classes.fieldLabel())}>
              Question
            </label>
            <textarea
              id="question"
              rows="4"
              placeholder="Enter your question here..."
              {...register("question")}
              className={clsx(classes.inputField())}
            />
            {errors.question && (
              <p className={clsx(classes.error())}>
                {capitalizeFirstLetter(errors.question.message)}
              </p>
            )}
          </div>
          <div>
            <label className={clsx(classes.fieldLabel())}>Options</label>
            <div>
              {fields.map((item, index) => (
                <div key={index}>
                  <div className={clsx(classes.optionContainer())}>
                    <div className="flex-1">
                      <input
                        id={`option-${index}`}
                        name={`option-${index}`}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        {...register(`options.${index}.value`)}
                        className={clsx(classes.inputField(true))}
                      />
                    </div>
                    <div className="flex-none px-4">
                      <input
                        type="checkbox"
                        className={clsx(classes.checkbox())}
                        {...register(`options.${index}.isCorrect`)}
                      />
                      <span className="font-semibold relative bottom-2 ml-2">
                        Correct?
                      </span>
                    </div>
                    <div className="flex-none">
                      <button
                        className={clsx(classes.removeButton())}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {errors.options?.[index]?.value?.message && (
                    <p className={clsx(classes.error())}>
                      {capitalizeFirstLetter(
                        errors.options?.[index]?.value?.message
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            {optionErrorsList.map((err, i) => (
              <p className={clsx(classes.error())} key={`err-${i}`}>
                {capitalizeFirstLetter(err)}
              </p>
            ))}
            <div className="grid grid-cols-2">
              <div>
                <button
                  onClick={() =>
                    append({
                      id: uuid(),
                      value: "",
                      isCorrect: false,
                      votes: 0,
                    })
                  }
                  className={clsx(classes.appendButton(options?.length >= 6))}
                  disabled={options?.length >= 6}
                >
                  Add Another Option
                </button>
              </div>
              <div className="text-right">
                <input
                  type="submit"
                  value="Ask question ->"
                  className={clsx(
                    classes.appendButton(
                      !isValid || isSubmitting || optionErrorsList.length !== 0
                    )
                  )}
                  disabled={
                    !isValid || isSubmitting || optionErrorsList.length !== 0
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
