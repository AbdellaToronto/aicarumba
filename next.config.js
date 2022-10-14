module.exports = {
  async rewrites() {
    return [
      {
        source: "/sd",
        destination: "https://stablediffusion-3kkdwicjvq-uc.a.run.app",
      },
    ];
  },
};
