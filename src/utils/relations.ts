const relations = {
  findWishesByUsername: {
    wishes: {
      owner: true,
      offers: {
        item: {
          owner: true,
          offers: {
            item: {
              owner: true,
              offers: true,
            },
          },
        },
      },
    },
  },
  findCurrentUserWishes: {
    wishes: {
      owner: true,
      offers: true,
    },
  },
};

export default relations;
