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
  button: (isDisabled = false) => [
    `

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
  heading: () => [
    `
    font-bold
    text-2xl
    pb-3
    text-slate-800
    tracking-tight
    `,
  ],
  optionContainer: () => [
    `
    text-lg
    font-semibold
    text-slate-800
    mb-3
    `,
  ],
  title: () => [
    `
    text-3xl
    font-bold
    text-center
    text-slate-800
    mb-3
    `,
  ],
  waitingForQuestion: () => [
    `
    w-1/2
    h-1/2
    text-3xl
    lg:text-5xl
    text-center
    bg-yellow-400
    p-6
    m-3
    rounded-lg
    shadow-xl
    transition 
    duration-700
    hover:scale-105
    hover:shadow-2xl
    text-slate-800
    tracking-tight
    font-bold
    grid 
    place-items-center
    `,
  ],
};
