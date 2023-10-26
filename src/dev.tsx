export const dev = {
    log: (message: any | Blob | null) => {
      if (process.env.NEXT_PUBLIC_DEVELOPMENT_ENV === 'true') {
        console.log(message);
      }
    },
};