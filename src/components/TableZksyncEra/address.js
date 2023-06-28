const followAddress = [
  '0x11b1785d9ac81480c03210e89f1508c8c115888e', // twitter
]
const rabbitHoleAddress = [
  /**
   * rabbit hole
   * https://rabbithole.gg/leaderboard
   *  */
  '0xbed050c15224a53a12815fa79f2b1ef431887eb2',
  '0xa99f898530df1514a566f1a6562d62809e99557d',
  '0xa2b430fffa485250ddd20a81b609f507728b4ccf',
]

const debankFollowAddress = [
  /**
   * debank airdrop hunt
   * https://debank.com/profile/0x7e7f6037d8faaa29e1f70fb2bd22ce79a2dd8eae/following
   *  */
  '0xbed050c15224a53a12815fa79f2b1ef431887eb2',
  '0x11b1785d9ac81480c03210e89f1508c8c115888e',
]

export const e = [
  ...followAddress,
  ...rabbitHoleAddress,
  ...debankFollowAddress,
  '0x7e7F6037d8FaaA29e1F70fb2BD22CE79A2dd8eAe',
  '0xc7569c202D081e8C96DdC9a11f7a05eB769d3401',
  '0x662eCD08a9A37bFcE5E1d23D29247339780D3559',
  '0x1935cDB4D21B9daa364005D959172118E4e6CD82',
  '0x0e210C294E412De6998081E472673C2993E7c4aB'
]

export const c = {
  '0x7e7F6037d8FaaA29e1F70fb2BD22CE79A2dd8eAe': {
    marker: [
      '$13 LP: Syncswap',
      '$10 LP: Maverick',
    ]
  },
  '0xc7569c202D081e8C96DdC9a11f7a05eB769d3401': {
    marker: [
      '$41 LP: Syncswap',
      '$13 LP: Maverick',
    ]
  },
  '0x1935cdb4d21b9daa364005d959172118e4e6cd82': {
    marker: [
      '$41 LP: Syncswap',
    ]
  },
  '0x662eCD08a9A37bFcE5E1d23D29247339780D3559': {
    marker: [
      'Low Cost',
      '$21 LP: Syncswap',
    ]
  },
  '0x0e210C294E412De6998081E472673C2993E7c4aB': {
    marker: [
      'Low Cost',
    ]
  },
  '0x88888e673E5BdC0B55a225D3B836449e270df6b1': {
    marker: [
      'Coffee',
    ]
  }
}
followAddress.forEach(address => {
  c[address] = {
    marker: [
      'Follow'
    ]
  }
})
rabbitHoleAddress.forEach(address => {
  c[address] = {
    marker: [
      'Follow', 'Rabbit Hole'
    ]
  }
})

rabbitHoleAddress.forEach(address => {
  c[address] = {
    marker: [
      'Follow', 'debank airdrop hunt'
    ]
  }
})
