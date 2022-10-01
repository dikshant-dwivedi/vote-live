export const classes = {
  container: () => [
    `
            bg-yellow-200
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
            text-center
            `,
  ],
  button: (isDisabled = false) => [
    `
      mt-2
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
