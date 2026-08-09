// The site's ink marks. Generated from the design handoff's ink-marks.json
// (design_handoff_ink_marks, "Entropia site color and texture redesign.zip",
// 2026-08-08) — the source of truth. Every number was placed by eye and tuned
// against the parchment; "close enough" visibly changes how the paper reads,
// so regenerate rather than hand-editing coordinates.
//
// x/y are the mark's CENTRE as a fraction of its [data-ink-anchor] section's
// box (values outside 0-1 are legal — that's a mark hanging off the edge); w
// is a fraction of the anchor's WIDTH, height follows the brush's aspect.
//
// The rules the numbers encode, for anything new: edges not centres; upright
// unless the throw is deliberate (never 12 deg or 24 deg — matching the
// section-cut angle reads as a failed clip-path); width 0.06-0.18; opacity
// 0.50-0.85; multiply by default, hard-light to hold value over a busy
// ground, darken for a whisper; never over reading text. Cart, Account and
// Legal carry no marks on purpose.

export interface InkEraseStroke {
  /** brush radius as a fraction of the mark's rendered width */
  r: number;
  /** feather; blur radius in px = soft * r * renderedWidth */
  soft: number;
  /** [u, v] in the mark's own 0-1 space. A single point is a dab, not a line. */
  pts: [number, number][];
}

export interface InkItem {
  src: string;
  /** data-ink-anchor label, or '__page' for the whole page shell. */
  anchor: string;
  x: number;
  y: number;
  w: number;
  /** degrees, clockwise */
  rot: number;
  op: number;
  blend: string;
  /**
   * bg    — under the section's paper, a stain in the stock.
   * mid   — over the paper, under the cards and type. The workhorse.
   * front — over everything, type included. Low opacity or a corner only.
   */
  layer: "bg" | "mid" | "front";
  /** horizontal / vertical flip. Unused site-wide — every mirror is a rotation. */
  fx: boolean;
  fy: boolean;
  /**
   * Key into ERASE. A *reference*, not inlined strokes, so the editor can
   * round-trip a mark through JSON without carrying hundreds of coordinates —
   * and so Chaosverb's rotational pair provably shares one stroke set.
   */
  eraseRef?: string;
  /** Why this mark is where it is. Re-emitted as a comment on save. */
  note?: string;
}

/** The strokes for a mark, or none. */
export const eraseFor = (it: InkItem): InkEraseStroke[] | undefined =>
  it.eraseRef ? ERASE[it.eraseRef] : undefined;

/**
 * Marks that are partly rubbed away. Destructive brushwork, not a mask: the
 * ink is drawn to a canvas and these strokes are punched out with
 * destination-out. Shared by ref because Chaosverb's rotational pair is one
 * mark used twice.
 */
export const ERASE: Record<string, InkEraseStroke[]> = {
  "home-el-1-1": [
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.1,0.309],[0.097,0.022],[0.09,0.022],[0.079,0.016],[0.073,0.016],[0.038,0.008],
        [0.037,0.003],[0.033,0.003],[0.03,0],[0.023,-0.003],[0.019,-0.003],[0.014,-0.003],
        [0.01,-0.003],[0.008,0],[0.003,0],[-0.003,0],[-0.007,0],[-0.011,0],[-0.018,-0.003],
        [-0.024,-0.003],[-0.031,-0.005],[-0.034,-0.011],[-0.04,-0.014],[-0.045,-0.016],
        [-0.049,-0.019],[-0.05,-0.022],[-0.053,-0.025],[-0.055,-0.03],[-0.06,-0.033],[-0.061,-0.038],
        [-0.063,-0.041],[-0.063,-0.046],[-0.063,-0.052],[-0.063,-0.057],[-0.061,-0.063],
        [-0.057,-0.066],[-0.05,-0.068],[-0.044,-0.068],[-0.034,-0.068],[-0.022,-0.068],
        [-0.009,-0.055],[0.003,-0.049],[0.015,-0.033],[0.022,-0.019],[0.027,-0.014],[0.032,0.003],
        [0.034,0.008],[0.037,0.014],[0.038,0.016],[0.038,0.022],[0.042,0.025],[0.044,0.027],
        [0.045,0.03],[0.047,0.033]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.063,0.167],[0.049,0.134],[0.042,0.115],[0.03,0.071],[0.018,0.033],[0.01,0.003],
        [0.004,-0.016],[0,-0.03],[-0.004,-0.046],[-0.007,-0.057],[-0.009,-0.066],[-0.012,-0.074],
        [-0.015,-0.082],[-0.019,-0.093],[-0.024,-0.107],[-0.026,-0.109],[-0.035,-0.128],
        [-0.041,-0.145],[-0.049,-0.158],[-0.052,-0.167],[-0.056,-0.172],[-0.063,-0.189],
        [-0.064,-0.194],[-0.065,-0.199],[-0.068,-0.202],[-0.07,-0.21],[-0.072,-0.213],
        [-0.074,-0.216],[-0.075,-0.219],[-0.075,-0.224],[-0.07,-0.224],[-0.068,-0.219],
        [-0.067,-0.216],[-0.064,-0.213],[-0.059,-0.205],[-0.057,-0.202],[-0.055,-0.197],
        [-0.052,-0.194],[-0.05,-0.189],[-0.048,-0.183],[-0.046,-0.18]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [-0.049,-0.104],[-0.045,-0.101],[-0.041,-0.098],[-0.031,-0.09],[-0.016,-0.074],
        [-0.007,-0.066],[0.006,-0.049],[0.011,-0.044],[0.021,-0.033],[0.03,-0.019],[0.037,-0.014],
        [0.042,-0.003],[0.049,0],[0.053,0.008],[0.058,0.016],[0.062,0.025],[0.066,0.03],[0.07,0.036],
        [0.073,0.038],[0.074,0.041],[0.077,0.046],[0.078,0.049],[0.082,0.052],[0.083,0.057],
        [0.085,0.06]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.078,0.735],[0.074,0.735],[0.066,0.727],[0.058,0.724],[0.047,0.716],[0.034,0.716],
        [0.027,0.713],[0.015,0.708],[0.003,0.708],[-0.008,0.708],[-0.024,0.708],[-0.037,0.705],
        [-0.05,0.705],[-0.063,0.705],[-0.076,0.705],[-0.083,0.697],[-0.093,0.691],[-0.101,0.691],
        [-0.108,0.691],[-0.117,0.68],[-0.127,0.672],[-0.141,0.672],[-0.147,0.667],[-0.153,0.661],
        [-0.16,0.664],[-0.165,0.664],[-0.169,0.664],[-0.173,0.664],[-0.175,0.661],[-0.177,0.658],
        [-0.175,0.656],[-0.172,0.653],[-0.171,0.65],[-0.167,0.648],[-0.161,0.642],[-0.154,0.637],
        [-0.142,0.631],[-0.13,0.628]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.201,0.37],[0.198,0.368],[0.194,0.367],[0.185,0.362],[0.179,0.361],[0.172,0.36],
        [0.168,0.357],[0.163,0.356],[0.155,0.352],[0.149,0.35],[0.145,0.349],[0.138,0.348],
        [0.129,0.344],[0.124,0.344],[0.12,0.343],[0.109,0.34],[0.103,0.338],[0.094,0.335],
        [0.088,0.333],[0.079,0.332],[0.075,0.33],[0.068,0.329],[0.059,0.325],[0.049,0.321],
        [0.041,0.32],[0.034,0.319],[0.029,0.317],[0.022,0.317],[0.015,0.316],[0.01,0.314],[0,0.312],
        [-0.007,0.311],[-0.014,0.309],[-0.024,0.308],[-0.031,0.305],[-0.037,0.305],[-0.044,0.302],
        [-0.05,0.301],[-0.057,0.298],[-0.063,0.297],[-0.068,0.294],[-0.072,0.293],[-0.076,0.292]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.168,0.597],[0.163,0.597],[0.15,0.592],[0.144,0.591],[0.135,0.587],[0.129,0.584],
        [0.123,0.583],[0.119,0.582],[0.114,0.58],[0.108,0.578],[0.101,0.576],[0.096,0.575],
        [0.089,0.572],[0.077,0.569],[0.071,0.568],[0.063,0.568],[0.058,0.566],[0.051,0.566],
        [0.044,0.564],[0.037,0.563],[0.03,0.563],[0.025,0.561],[0.021,0.559],[0.011,0.557],[0,0.555],
        [-0.007,0.555],[-0.016,0.552],[-0.026,0.551],[-0.035,0.549],[-0.042,0.549],[-0.053,0.547],
        [-0.057,0.547],[-0.067,0.545],[-0.074,0.544],[-0.082,0.544],[-0.091,0.54],[-0.097,0.539],
        [-0.104,0.536],[-0.111,0.535],[-0.116,0.532],[-0.123,0.528]
      ],
    },
  ],
  "fiction-el-1-11": [
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.999,0.757],[0.991,1.016],[0.986,1.066],[0.978,1.098],[0.958,1.156],[0.954,1.205],
        [0.942,1.221],[0.933,1.254],[0.917,1.312],[0.917,1.32],[0.913,1.32],[0.909,1.328],
        [0.905,1.328],[0.901,1.336],[0.897,1.336],[0.888,1.344],[0.884,1.353],[0.876,1.361],
        [0.872,1.385],[0.864,1.402],[0.864,1.41],[0.847,1.443],[0.843,1.459],[0.831,1.492],
        [0.831,1.5],[0.827,1.508],[0.823,1.516],[0.819,1.533],[0.819,1.541],[0.815,1.557],
        [0.811,1.566],[0.811,1.574],[0.811,1.533],[0.831,1.41],[0.852,1.32],[0.876,1.262],
        [0.892,1.205],[0.901,1.18],[0.913,1.156],[0.921,1.131],[0.925,1.123],[0.929,1.115],
        [0.942,1.107],[0.946,1.107],[0.954,1.098],[0.958,1.09],[0.966,1.082],[0.974,1.057],
        [0.986,1.049],[0.995,1.033],[1.007,1.025],[1.011,1],[1.019,0.984],[1.023,0.984],
        [1.036,0.975],[1.036,0.967],[1.04,0.959],[1.044,0.951],[1.048,0.934],[1.052,0.934],
        [1.056,0.926],[1.06,0.926]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.774,0.664]] },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.835,0.926],[0.852,0.926],[0.868,0.926],[0.892,0.917],[0.897,0.917],[0.905,0.913],
        [0.909,0.913],[0.913,0.913],[0.917,0.909],[0.933,0.896],[0.946,0.878],[0.954,0.848],
        [0.974,0.817],[0.978,0.796],[0.978,0.778],[0.978,0.774],[0.982,0.77],[0.982,0.765],
        [0.978,0.765],[0.974,0.765],[0.97,0.765],[0.966,0.765],[0.958,0.765],[0.954,0.765],
        [0.946,0.77],[0.937,0.77],[0.925,0.774],[0.917,0.783],[0.909,0.787],[0.901,0.8],
        [0.892,0.809],[0.88,0.826],[0.868,0.835],[0.864,0.844],[0.856,0.857],[0.856,0.865],
        [0.852,0.87],[0.852,0.878],[0.843,0.883],[0.843,0.891],[0.843,0.896],[0.835,0.9],[0.831,0.9],
        [0.831,0.904],[0.827,0.909]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.827,0.909],[0.835,0.909],[0.843,0.904],[0.847,0.904],[0.852,0.9],[0.856,0.9],[0.86,0.9],
        [0.868,0.9],[0.872,0.9],[0.876,0.904],[0.884,0.913],[0.888,0.935],[0.901,0.952],
        [0.917,0.991],[0.929,1.022],[0.942,1.039],[0.946,1.044],[0.95,1.048],[0.966,1.061],
        [0.966,1.065],[0.97,1.065],[0.97,1.07],[0.97,1.065],[0.97,1.052],[0.97,1.048],[0.97,1.039],
        [0.97,1.03],[0.97,1.026],[0.97,1.013],[0.97,1.009],[0.97,1.004],[0.97,1],[0.97,0.991],
        [0.97,0.983],[0.97,0.978],[0.97,0.974],[0.97,0.97],[0.97,0.965],[0.962,0.961],[0.962,0.957]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.962,0.957]] },
    { r: 0.09, soft: 0.35, pts: [[0.962,0.957]] },
    { r: 0.09, soft: 0.35, pts: [[0.962,0.957]] },
    { r: 0.09, soft: 0.35, pts: [[0.962,0.957]] },
    { r: 0.09, soft: 0.35, pts: [[0.5,0.974]] },
    { r: 0.09, soft: 0.35, pts: [[0.386,0.974]] },
  ],
  "about-el-3-8": [
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.93,0.917],[0.925,1.266],[0.917,1.266],[0.911,1.266],[0.899,1.266],[0.884,1.266],
        [0.873,1.266],[0.861,1.266],[0.849,1.266],[0.841,1.262],[0.828,1.262],[0.818,1.259],
        [0.813,1.259],[0.804,1.259],[0.797,1.259],[0.789,1.259],[0.782,1.259],[0.777,1.259],
        [0.771,1.259],[0.761,1.259],[0.758,1.262],[0.751,1.262],[0.747,1.266],[0.746,1.269],
        [0.742,1.276],[0.74,1.279],[0.74,1.286],[0.74,1.293],[0.742,1.297],[0.744,1.303],
        [0.747,1.307],[0.754,1.314],[0.758,1.317],[0.77,1.328],[0.782,1.331],[0.789,1.338],
        [0.797,1.341],[0.806,1.345],[0.815,1.348],[0.82,1.348],[0.827,1.348],[0.834,1.348],
        [0.841,1.348],[0.846,1.341],[0.856,1.331],[0.865,1.328],[0.88,1.31],[0.896,1.3],
        [0.915,1.286],[0.923,1.283],[0.934,1.276],[0.939,1.276],[0.946,1.272],[0.951,1.272],
        [0.958,1.272],[0.963,1.272],[0.97,1.279],[0.98,1.283],[0.984,1.286],[0.991,1.29],
        [0.993,1.293],[0.994,1.3],[0.996,1.303],[0.994,1.307],[0.987,1.307],[0.98,1.307],
        [0.975,1.307]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.854,1.331],[0.885,1.331],[0.892,1.331],[0.904,1.331],[0.913,1.331],[0.922,1.331],
        [0.93,1.331],[0.942,1.331],[0.953,1.331],[0.965,1.331],[0.972,1.334],[0.977,1.341],
        [0.982,1.341],[0.986,1.345],[0.977,1.345],[0.965,1.341],[0.944,1.338],[0.93,1.331],
        [0.911,1.331],[0.887,1.328],[0.875,1.321],[0.863,1.317],[0.846,1.307],[0.827,1.3],
        [0.808,1.297],[0.794,1.29],[0.777,1.29],[0.761,1.29],[0.752,1.29],[0.74,1.29],[0.735,1.297],
        [0.73,1.297],[0.728,1.3]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.727,1.3]] },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.77,1.21],[0.775,1.245],[0.78,1.269],[0.784,1.29],[0.787,1.314],[0.79,1.328],[0.794,1.338],
        [0.801,1.352],[0.806,1.359],[0.811,1.366],[0.823,1.372],[0.828,1.379],[0.844,1.386],
        [0.853,1.397],[0.863,1.403],[0.875,1.417],[0.884,1.428],[0.894,1.431],[0.903,1.445],
        [0.908,1.448],[0.915,1.452],[0.92,1.452],[0.925,1.459],[0.932,1.459],[0.939,1.459],
        [0.944,1.459],[0.956,1.455],[0.961,1.455],[0.965,1.452],[0.972,1.452],[0.977,1.448],
        [0.98,1.445],[0.986,1.441],[0.989,1.438],[0.991,1.434],[0.993,1.428],[0.994,1.424],
        [0.994,1.417],[0.994,1.41],[0.994,1.403]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.55,0.883]] },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.811,1.386],[0.832,1.345],[0.877,1.269],[0.906,1.245],[0.927,1.234],[0.963,1.217],
        [0.996,1.217],[1.01,1.221],[1.046,1.221],[1.065,1.231],[1.081,1.238],[1.101,1.255],
        [1.12,1.259],[1.133,1.259],[1.138,1.259],[1.145,1.259],[1.15,1.259],[1.155,1.259],
        [1.15,1.259],[1.138,1.259],[1.129,1.259],[1.105,1.259],[1.088,1.259],[1.062,1.252],
        [1.015,1.238],[0.941,1.238],[0.898,1.248],[0.823,1.255],[0.799,1.262],[0.737,1.3],
        [0.711,1.31],[0.68,1.328],[0.675,1.338],[0.668,1.341]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.797,1.186]] },
    { r: 0.09, soft: 0.35, pts: [[0.797,1.186]] },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.797,1.186],[0.797,1.197],[0.806,1.221],[0.816,1.259],[0.823,1.29]
      ],
    },
    { r: 0.09, soft: 0.35, pts: [[0.879,1.476]] },
    { r: 0.09, soft: 0.35, pts: [[0.879,1.476]] },
    { r: 0.09, soft: 0.35, pts: [[0.879,1.476]] },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.815,0.911],[0.822,0.919],[0.83,0.934],[0.832,0.94],[0.837,0.945],[0.842,0.953],
        [0.849,0.959],[0.853,0.962],[0.86,0.966],[0.863,0.968],[0.866,0.97],[0.87,0.972],
        [0.872,0.975],[0.873,0.981],[0.877,0.983],[0.879,0.987],[0.875,0.989],[0.87,0.991],
        [0.858,0.991],[0.841,0.991],[0.822,0.987],[0.806,0.981],[0.794,0.979],[0.785,0.975],
        [0.778,0.974],[0.775,0.972],[0.771,0.97],[0.766,0.97],[0.761,0.97],[0.756,0.97],[0.751,0.97],
        [0.746,0.97],[0.752,0.97],[0.759,0.972],[0.766,0.972],[0.77,0.974],[0.78,0.974],
        [0.785,0.974],[0.792,0.974],[0.801,0.974],[0.808,0.974],[0.815,0.974],[0.82,0.974],
        [0.825,0.972],[0.83,0.972],[0.835,0.968],[0.841,0.968],[0.842,0.964],[0.846,0.962],
        [0.853,0.96]
      ],
    },
  ],
  "chaosverb-el-1-0": [
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.148,0.098],[0.143,0.01],[0.126,0.01],[0.121,0.01],[0.116,0.01],[0.111,0.01],[0.106,0.01],
        [0.101,0.01],[0.096,0.01],[0.091,0.01],[0.086,0.01],[0.081,0.01],[0.069,0.01],[0.064,0.01],
        [0.051,0.01],[0.041,0.015],[0.029,0.015],[0.019,0.015],[0.012,0.02],[-0.001,0.02],
        [-0.006,0.02],[-0.016,0.02],[-0.018,0.03],[-0.023,0.03],[-0.028,0.03],[-0.038,0.03],
        [-0.043,0.035],[-0.05,0.035],[-0.055,0.04],[-0.058,0.045],[-0.058,0.05],[-0.053,0.055],
        [-0.045,0.055],[-0.04,0.06],[-0.033,0.069],[-0.023,0.074],[-0.006,0.089],[0.007,0.094],
        [0.019,0.099],[0.034,0.109],[0.041,0.114],[0.051,0.119],[0.059,0.119],[0.066,0.124],
        [0.071,0.124],[0.076,0.124],[0.084,0.124],[0.088,0.124],[0.091,0.119],[0.096,0.119],
        [0.108,0.109],[0.116,0.104],[0.121,0.104],[0.123,0.099],[0.133,0.094],[0.136,0.084],
        [0.141,0.074],[0.146,0.065],[0.148,0.055],[0.158,0.03],[0.178,0],[0.188,-0.03],
        [0.203,-0.059],[0.212,-0.084],[0.217,-0.104],[0.225,-0.119],[0.232,-0.134],[0.235,-0.143],
        [0.242,-0.158],[0.247,-0.163],[0.25,-0.168],[0.255,-0.173],[0.257,-0.178],[0.265,-0.178],
        [0.269,-0.183],[0.282,-0.183],[0.289,-0.183],[0.299,-0.178],[0.307,-0.173],[0.322,-0.158],
        [0.329,-0.148],[0.334,-0.143],[0.341,-0.138],[0.341,-0.134],[0.344,-0.124],[0.346,-0.119],
        [0.349,-0.114],[0.351,-0.109],[0.351,-0.104],[0.351,-0.099],[0.351,-0.094],[0.349,-0.084],
        [0.344,-0.074],[0.334,-0.064],[0.319,-0.054],[0.302,-0.035],[0.289,-0.02],[0.272,-0.015],
        [0.262,0],[0.255,0],[0.245,0.005],[0.24,0.01],[0.237,0.015],[0.232,0.015],[0.227,0.02],
        [0.222,0.02],[0.22,0.025],[0.215,0.025],[0.208,0.025],[0.208,0.03],[0.203,0.03],[0.198,0.03],
        [0.193,0.03],[0.188,0.03],[0.183,0.03],[0.178,0.03],[0.173,0.03],[0.16,0.03],[0.15,0.03],
        [0.146,0.03],[0.138,0.03],[0.131,0.025],[0.123,0.025],[0.118,0.025],[0.111,0.025],
        [0.106,0.025],[0.101,0.02],[0.091,0.02],[0.086,0.02],[0.076,0.02],[0.071,0.02],[0.064,0.02],
        [0.056,0.02],[0.051,0.02],[0.046,0.02],[0.039,0.02],[0.034,0.025],[0.031,0.03],[0.027,0.03],
        [0.019,0.035],[0.014,0.035],[0.009,0.035],[0.004,0.035],[-0.003,0.035],[-0.008,0.035],
        [-0.013,0.035],[-0.013,0.04],[-0.018,0.04],[-0.023,0.04]
      ],
    },
    // Rubbing out the brush's SECOND arc — the ribbon that peeled off the main
    // sweep and ran down the right-hand side. Traced from the brush's own ink
    // centreline rather than drawn freehand, so the cut follows the stroke
    // instead of gashing across it. Four passes because the arc is fat at the
    // top (0.27 of the mark) and thin at the foot: three overlapping 0.09
    // brushes cover the shoulder, one 0.075 follows the tail. Radius stays at
    // the system's 0.09 on purpose — a wider brush reaches far enough with its
    // feather to lighten the main sweep's top tail.
    // Both Chaosverb marks share this array, so the pair loses the arc
    // together and stays a true rotational twin.
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [1.049,0.335],[1.014,0.361],[1.001,0.386],[0.998,0.412],[0.936,0.437],[0.899,0.463],
        [0.892,0.488],[0.843,0.514],[0.811,0.54]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [0.959,0.375],[0.924,0.401],[0.911,0.426],[0.908,0.452],[0.846,0.477],[0.809,0.503],
        [0.802,0.528],[0.753,0.554],[0.721,0.58]
      ],
    },
    {
      r: 0.09,
      soft: 0.35,
      pts: [
        [1.004,0.355],[0.969,0.381],[0.956,0.406],[0.953,0.432],[0.891,0.457],[0.854,0.483],
        [0.847,0.508],[0.798,0.534],[0.766,0.56]
      ],
    },
    {
      r: 0.075,
      soft: 0.35,
      pts: [
        [0.798,0.534],[0.766,0.56],[0.744,0.585],[0.724,0.611],[0.704,0.636],[0.69,0.662],
        [0.678,0.688],[0.662,0.713],[0.651,0.739],[0.638,0.764],[0.634,0.79],[0.627,0.815],
        [0.618,0.841],[0.615,0.867],[0.608,0.892],[0.612,0.918],[0.616,0.943],[0.626,0.969],
        [0.641,0.994],[0.636,1.02]
      ],
    },
  ],
};

// <ink-placements>  —  DO NOT hand-edit between these markers.
// This block is rewritten verbatim by the in-app ink editor (dev only, see
// src/components/ink/InkEditor.tsx). Anything you type here — including
// comments other than each mark's `note` — is lost on the next save. The
// ERASE data above and this file's header are never touched by the editor.
export const INK_PAGES: Record<string, InkItem[]> = {
  // entropia-website — 5 marks
  "entropia-website": [
    // The faintest mark in the system. Sits on top of the quote strip at 31%
    // darken so it only bites the paper, never the type.
    {
      src: "/ink/el-3-14.webp",
      anchor: "Quotes",
      layer: "front",
      x: 0.2611,
      y: 0.7985,
      w: 0.13,
      rot: 0,
      op: 0.31,
      blend: "darken",
      fx: false,
      fy: false,
      note: "The faintest mark in the system. Sits on top of the quote strip at 31% darken so it only bites the paper, never the type.",
    },
    // Half off the left edge of the approach band. The handoff paired this with
    // a bg stain of the same brush at 0.1334/0.7456 — one brush reading twice at
    // two depths; the bg half was removed on request (2026-08-09).
    {
      src: "/ink/el-4-1.webp",
      anchor: "Approach",
      layer: "mid",
      x: 0.0291,
      y: 0.8462,
      w: 0.13,
      rot: 0,
      op: 0.6,
      blend: "hard-light",
      fx: false,
      fy: false,
      note: "Half off the left edge of the approach band. The handoff paired this with a bg stain of the same brush at 0.1334/0.7456 — one brush reading twice at two depths; the bg half was removed on request (2026-08-09).",
    },
    // The big right-hand sweep. Oversized on purpose and then rubbed back with 6
    // erase strokes so it dies out before it reaches the copy — the erasure is
    // what makes the scale legal.
    {
      src: "/ink/el-1-1.webp",
      anchor: "Approach",
      layer: "mid",
      x: 0.9081,
      y: 0.4667,
      w: 0.3185,
      rot: -7.9,
      op: 0.53,
      blend: "hard-light",
      fx: false,
      fy: false,
      eraseRef: "home-el-1-1",
      note: "The big right-hand sweep. Oversized on purpose and then rubbed back with 6 erase strokes so it dies out before it reaches the copy — the erasure is what makes the scale legal.",
    },
    // Top-left corner of the plugin grid, mostly outside the section box. Marks
    // the seam where the band starts.
    {
      src: "/ink/el-2-13.webp",
      anchor: "The plugins",
      layer: "mid",
      x: 0.0443,
      y: 0.0114,
      w: 0.13,
      rot: 0,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "Top-left corner of the plugin grid, mostly outside the section box. Marks the seam where the band starts.",
    },
    // The one full-opacity mark on the site. Same brush as the one above thrown
    // to -36 deg and stacked on top — a deliberate double-strike, like the stamp
    // landed twice.
    {
      src: "/ink/el-2-13.webp",
      anchor: "The plugins",
      layer: "front",
      x: 0.0283,
      y: 0.0319,
      w: 0.1819,
      rot: -36,
      op: 1,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "The one full-opacity mark on the site. Same brush as the one above thrown to -36 deg and stacked on top — a deliberate double-strike, like the stamp landed twice.",
    },
  ],
  // fiction — 3 marks
  "fiction": [
    // Page-anchored, not section-anchored: it hangs off the right margin and
    // stays there regardless of how the sections reflow.
    {
      src: "/ink/el-2-0.webp",
      anchor: "__page",
      layer: "mid",
      x: 0.9395,
      y: 0.2704,
      w: 0.13,
      rot: 0,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "Page-anchored, not section-anchored: it hangs off the right margin and stays there regardless of how the sections reflow.",
    },
    // The mirror of the right-margin mark, flipped by rotation (187.2 deg, not
    // 180) so the pair never reads as a symmetrical clip-art frame.
    {
      src: "/ink/el-2-0.webp",
      anchor: "__page",
      layer: "mid",
      x: 0.0548,
      y: 0.5595,
      w: 0.13,
      rot: 187.2,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "The mirror of the right-margin mark, flipped by rotation (187.2 deg, not 180) so the pair never reads as a symmetrical clip-art frame.",
    },
    // A wash, not a mark: half the section wide, stood on end at 89 deg, 15%
    // opacity. It exists to warm the left of the notify block, and should read
    // as uneven paper.
    {
      src: "/ink/el-4-7.webp",
      anchor: "Notify",
      layer: "mid",
      x: 0.1659,
      y: 0.5455,
      w: 0.325,
      rot: 90.9,
      op: 0.15,
      blend: "hard-light",
      fx: false,
      fy: false,
      note: "A wash, not a mark: half the section wide, stood on end at 89 deg, 15% opacity. It exists to warm the left of the notify block, and should read as uneven paper.",
    },
  ],
  // about — 2 marks
  "about": [
    // Over the headline block, right of centre, at half strength — a smudge
    // across the whitespace beside the type, never across the type.
    {
      src: "/ink/el-1-9.webp",
      anchor: "About headline",
      layer: "front",
      x: 0.724,
      y: 0.5947,
      w: 0.1879,
      rot: 0,
      op: 0.5,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "Over the headline block, right of centre, at half strength — a smudge across the whitespace beside the type, never across the type.",
    },
    // The most worked mark in the system: 13 erase strokes chew the lower-right
    // away so the remaining ink hugs the left gutter beside the contact block.
    {
      src: "/ink/el-3-8.webp",
      anchor: "Contact",
      layer: "mid",
      x: 0.1144,
      y: 0.528,
      w: 0.2519,
      rot: 0,
      op: 0.75,
      blend: "hard-light",
      fx: false,
      fy: false,
      eraseRef: "about-el-3-8",
      note: "The most worked mark in the system: 13 erase strokes chew the lower-right away so the remaining ink hugs the left gutter beside the contact block.",
    },
  ],
  // chaosverb — 2 marks
  "chaosverb": [
    // Top-right corner of the UI plate, one erase stroke through its middle to
    // open a hole for the version badge — anchored to the plate so the hole
    // stays on the badge at every width.
    {
      src: "/ink/el-1-0.webp",
      anchor: "Product shot",
      layer: "mid",
      x: 1.0719,
      y: 0.0626,
      w: 0.2675,
      rot: 0,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      eraseRef: "chaosverb-el-1-0",
      note: "Top-right corner of the UI plate, one erase stroke through its middle to open a hole for the version badge — anchored to the plate so the hole stays on the badge at every width.",
    },
    // The mark above duplicated and rotated exactly 180 deg into the opposite
    // corner, erase stroke included. A rotational pair — the only place the
    // system uses perfect symmetry, so keep both on the same eraseRef.
    {
      src: "/ink/el-1-0.webp",
      anchor: "Product shot",
      layer: "mid",
      x: -0.0405,
      y: 0.8907,
      w: 0.368,
      rot: 180,
      op: 0.75,
      blend: "multiply",
      fx: false,
      fy: false,
      eraseRef: "chaosverb-el-1-0",
      note: "The mark above duplicated and rotated exactly 180 deg into the opposite corner, erase stroke included. A rotational pair — the only place the system uses perfect symmetry, so keep both on the same eraseRef.",
    },
  ],
  // checkout — 1 mark
  "checkout": [
    // One small mark, upper right, half strength. Transactional pages get
    // exactly one and it stays out of the form's way.
    {
      src: "/ink/el-4-3.webp",
      anchor: "Checkout body",
      layer: "mid",
      x: 0.8694,
      y: 0.2134,
      w: 0.1013,
      rot: 0,
      op: 0.5,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "One small mark, upper right, half strength. Transactional pages get exactly one and it stays out of the form's way.",
    },
  ],
  // ordersuccess — 1 mark
  "ordersuccess": [
    // The smallest mark on the site (7% of the body width). A full stop after
    // the confirmation, not a decoration.
    {
      src: "/ink/el-3-13.webp",
      anchor: "Order body",
      layer: "front",
      x: 0.8746,
      y: 0.135,
      w: 0.0709,
      rot: 0,
      op: 0.55,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "The smallest mark on the site (7% of the body width). A full stop after the confirmation, not a decoration.",
    },
  ],
  // activate — 1 mark
  "activate": [
    // Mirrors Checkout's placement almost exactly — the utility pages share one
    // gesture so they feel like a set.
    {
      src: "/ink/el-2-12.webp",
      anchor: "Activate body",
      layer: "mid",
      x: 0.879,
      y: 0.2012,
      w: 0.122,
      rot: 0,
      op: 0.55,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "Mirrors Checkout's placement almost exactly — the utility pages share one gesture so they feel like a set.",
    },
  ],
  // notfound — 2 marks
  "notfound": [
    // Upper right, the larger of the pair.
    {
      src: "/ink/el-2-9.webp",
      anchor: "404 body",
      layer: "mid",
      x: 0.839,
      y: 0.2853,
      w: 0.1621,
      rot: 0,
      op: 0.6,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "Upper right, the larger of the pair.",
    },
    // A small answering fleck low and right — the diagonal between the two is
    // the page's only movement.
    {
      src: "/ink/el-4-11.webp",
      anchor: "404 body",
      layer: "mid",
      x: 0.7095,
      y: 0.8532,
      w: 0.0609,
      rot: 0,
      op: 0.5,
      blend: "multiply",
      fx: false,
      fy: false,
      note: "A small answering fleck low and right — the diagonal between the two is the page's only movement.",
    },
  ],
};
// </ink-placements>
