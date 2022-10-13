module.exports = {
  async rewrites() {
    return [
      {
        source: "/stablediffusion",
        destination: "https://stablediffusion-3kkdwicjvq-uc.a.run.app",
      },
    ];
  },
};
