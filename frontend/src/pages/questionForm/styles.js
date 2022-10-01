export const classes = {
  container: () => [
    `
        bg-yellow-400
        w-4/5
        xl:w-1/2
        p-6
        m-3
        rounded-lg
        shadow-xl
        transition 
        duration-700
        hover:scale-105
        hover:shadow-2xl
        `,
  ],
  optionContainer: () => [
    `
    my-1
    flex 
    items-center 
    justify-between
    `,
  ],
  fieldLabel: () => [
    `
        block
        text-2xl
        my-2
        font-bold
        text-slate-700
        `,
  ],
  checkbox: () => [
    `
    w-6 
    h-6 
    rounded
    `,
  ],
  removeButton: () => [
    `
    bg-red-600
    py-2
    px-3
    font-semibold
    rounded
    shadow-md
    text-white
    `,
  ],
  appendButton: (isDisabled = false) => [
    `
    py-2
    px-3
    font-semibold
    rounded
    shadow-md
    mt-2
    `,
    isDisabled
      ? `
        bg-slate-500
        text-slate-100
        `
      : `
        bg-green-600
        text-white
        transition 
        hover:scale-110
        active:scale-90
        hover:shadow-2xl
        cursor-pointer
        `,
  ],
  inputField: (isOption = false) => [
    `
        mt-1
        p-3
        bg-rose-100
        w-full
        rounded
        placeholder:text-slate-700
        placeholder:font-bold
        border-slate-700
        border-2
        mx-1
        `,
  ],
  error: () => [
    `
        text-sm
        text-red-500
        font-bold
        m-1
        `,
  ],
  button: () => [
    `
        bg-rose-800
        text-slate-200
        transition 
        hover:scale-110
        active:scale-90
        hover:shadow-2xl
        rounded-md
        px-5
        py-3
        text-lg
        font-bold
        shadow-lg
        tracking-wide
        `,
  ],
};
