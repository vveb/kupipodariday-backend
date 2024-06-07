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
  findOffers: {
    item: {
      owner: true,
      offers: true,
    },
    user: {
      wishes: {
        owner: true,
        offers: true,
      },
      offers: {
        user: true,
      },
      wishlists: {
        owner: true,
        items: true,
      },
    },
  },
};

export default relations;
