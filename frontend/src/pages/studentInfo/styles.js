export const classes = {
  container: () => [
    `
      bg-yellow-400
      sm:w-1/2
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
  fieldLabel: () => [
    `
      block
      text-2xl
      my-2
      font-bold
      text-slate-700
      `,
  ],
  inputField: () => [
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
      `,
  ],
  error: () => [
    `
      text-sm
      text-red-500
      font-bold
      pt-2
      `,
  ],
  button: (isDisabled = false) => [
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
    isDisabled
      ? `
      bg-slate-500
      text-slate-100
      `
      : `
      bg-rose-800
      text-slate-200
      transition 
      hover:scale-110
      active:scale-90
      hover:shadow-2xl
      cursor-pointer
      `,
  ],
};
