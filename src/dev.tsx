export const dev = {
    log: (...messages: (any | Blob | null)[]) => {
      if (process.env.NEXT_PUBLIC_DEVELOPMENT_ENV === 'true') {
        console.log(...messages);
      }
    },
};