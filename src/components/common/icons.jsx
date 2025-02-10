const DefaultBadgeIcon = ({ className, width = 19, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.5 0L0 4.36364V10.9091C0 16.9636 4.05333 22.6255 9.5 24C14.9467 22.6255 19 16.9636 19 10.9091V4.36364L9.5 0ZM12.7511 16.3636L9.5 14.3455L6.25944 16.3636L7.11444 12.5455L4.25389 9.99273L8.03278 9.65455L9.5 6.05455L10.9672 9.64364L14.7461 9.98182L11.8856 12.5455L12.7511 16.3636Z"
      fill="currentColor"
    />
  </svg>
);

const InstructorIcon = ({ className, width = 20, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 20C8.68678 20 7.38642 19.7413 6.17317 19.2388C4.95991 18.7362 3.85752 17.9997 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C15.5 0 20 4 20 9C20 10.5913 19.3679 12.1174 18.2426 13.2426C17.1174 14.3679 15.5913 15 14 15H12.2C11.9 15 11.7 15.2 11.7 15.5C11.7 15.6 11.8 15.7 11.8 15.8C12.2 16.3 12.4 16.9 12.4 17.5C12.5 18.9 11.4 20 10 20ZM10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18C10.3 18 10.5 17.8 10.5 17.5C10.5 17.3 10.4 17.2 10.4 17.1C10 16.6 9.8 16.1 9.8 15.5C9.8 14.1 10.9 13 12.3 13H14C15.0609 13 16.0783 12.5786 16.8284 11.8284C17.5786 11.0783 18 10.0609 18 9C18 5.1 14.4 2 10 2ZM4.5 8C5.3 8 6 8.7 6 9.5C6 10.3 5.3 11 4.5 11C3.7 11 3 10.3 3 9.5C3 8.7 3.7 8 4.5 8ZM7.5 4C8.3 4 9 4.7 9 5.5C9 6.3 8.3 7 7.5 7C6.7 7 6 6.3 6 5.5C6 4.7 6.7 4 7.5 4ZM12.5 4C13.3 4 14 4.7 14 5.5C14 6.3 13.3 7 12.5 7C11.7 7 11 6.3 11 5.5C11 4.7 11.7 4 12.5 4ZM15.5 8C16.3 8 17 8.7 17 9.5C17 10.3 16.3 11 15.5 11C14.7 11 14 10.3 14 9.5C14 8.7 14.7 8 15.5 8Z"
      fill="currentColor"
    />
  </svg>
);

const StudentIcon = ({ className, width = 21, height = 18 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.975 14.5C3.64167 14.3167 3.38333 14.071 3.2 13.763C3.01667 13.455 2.925 13.109 2.925 12.725V7.92502L0.525 6.60002C0.341667 6.50002 0.208333 6.37502 0.125 6.22502C0.0416667 6.07502 0 5.90835 0 5.72502C0 5.54168 0.0416667 5.37502 0.125 5.22502C0.208333 5.07502 0.341667 4.95002 0.525 4.85002L8.975 0.250016C9.125 0.166682 9.27933 0.104015 9.438 0.0620154C9.59667 0.0200154 9.759 -0.000651042 9.925 1.56251e-05C10.091 0.000682292 10.2537 0.0216823 10.413 0.0630156C10.5723 0.104349 10.7263 0.166682 10.875 0.250016L20.4 5.45002C20.5667 5.53335 20.696 5.65435 20.788 5.81302C20.88 5.97168 20.9257 6.14235 20.925 6.32502V12.725C20.925 13.0083 20.829 13.246 20.637 13.438C20.445 13.63 20.2077 13.7257 19.925 13.725C19.6423 13.7243 19.405 13.6283 19.213 13.437C19.021 13.2457 18.925 13.0083 18.925 12.725V6.82502L16.925 7.92502V12.725C16.925 13.1083 16.8333 13.4543 16.65 13.763C16.4667 14.0717 16.2083 14.3173 15.875 14.5L10.875 17.2C10.725 17.2833 10.571 17.346 10.413 17.388C10.255 17.43 10.0923 17.4507 9.925 17.45C9.75767 17.4493 9.595 17.4287 9.437 17.388C9.279 17.3473 9.125 17.2847 8.975 17.2L3.975 14.5ZM9.925 9.42502L16.775 5.72502L9.925 2.02502L3.075 5.72502L9.925 9.42502ZM9.925 15.45L14.925 12.75V8.97502L10.9 11.2C10.75 11.2833 10.5917 11.346 10.425 11.388C10.2583 11.43 10.0917 11.4507 9.925 11.45C9.75833 11.4493 9.59167 11.4287 9.425 11.388C9.25833 11.3473 9.1 11.2847 8.95 11.2L4.925 8.97502V12.75L9.925 15.45Z"
      fill="currentColor"
    />
  </svg>
);

// 즐겨찾기 아이콘 추가
const SubscribeIcon = ({
  className = '',
  width = 20,
  height = 20,
  stroke = 'black',
  strokeWidth = 2,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4.5 5.5C4.5 5.76522 4.60536 6.01957 4.79289 6.20711C4.98043 6.39464 5.23478 6.5 5.5 6.5C5.76522 6.5 6.01957 6.39464 6.20711 6.20711C6.39464 6.01957 6.5 5.76522 6.5 5.5C6.5 5.23478 6.39464 4.98043 6.20711 4.79289C6.01957 4.60536 5.76522 4.5 5.5 4.5C5.23478 4.5 4.98043 4.60536 4.79289 4.79289C4.60536 4.98043 4.5 5.23478 4.5 5.5Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 4V9.172C1.00011 9.70239 1.2109 10.211 1.586 10.586L9.296 18.296C9.74795 18.7479 10.3609 19.0017 11 19.0017C11.6391 19.0017 12.252 18.7479 12.704 18.296L18.296 12.704C18.7479 12.252 19.0017 11.6391 19.0017 11C19.0017 10.3609 18.7479 9.74795 18.296 9.296L10.586 1.586C10.211 1.2109 9.70239 1.00011 9.172 1H4C3.20435 1 2.44129 1.31607 1.87868 1.87868C1.31607 2.44129 1 3.20435 1 4Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 즐겨찾기 아이콘
const FavoriteIcon = ({
  className = '',
  width = 15,
  height = 19,
  stroke = 'black',
  strokeWidth = 2,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 18L7.5 13.2778L1 18V2.88889C1 2.38792 1.19566 1.90748 1.54394 1.55324C1.89223 1.19901 2.3646 1 2.85714 1H12.1429C12.6354 1 13.1078 1.19901 13.4561 1.55324C13.8043 1.90748 14 2.38792 14 2.88889V18Z"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoginHi = ({ className = '', width = 134, height = 163, fill = '#FF5C38' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 134 163"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M65.3659 0C74.3537 0 81.7073 7.335 81.7073 16.3C81.7073 25.265 74.3537 32.6 65.3659 32.6C56.378 32.6 49.0244 25.265 49.0244 16.3C49.0244 7.335 56.378 0 65.3659 0ZM97.2317 49.715C93.9634 46.455 88.2439 40.75 77.6219 40.75H57.1951C34.3171 40.75 16.3415 22.82 16.3415 0H0C0 26.08 17.1585 47.27 40.8537 54.605V163H57.1951V114.1H73.5366V163H89.878V66.015L122.561 97.8L134 86.39L97.2317 49.715Z"
      fill={fill}
    />
  </svg>
);

const StatisticsIcon = ({ className = '', width = 42, height = 53 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 53"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M38 49.3333V21"
      stroke="black"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 49.3333V4"
      stroke="black"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 49.334V32.334"
      stroke="black"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 잠금 해제 아이콘
const LockOpenIcon = ({ className = '', width = 24, height = 24, fill = 'black' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V10C4 9.45 4.196 8.97933 4.588 8.588C4.98 8.19667 5.45067 8.00067 6 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.3 3 10.6873 3.21267 10.162 3.638C9.63667 4.06333 9.28267 4.59233 9.1 5.225C9.03333 5.45833 8.89567 5.646 8.687 5.788C8.47833 5.93 8.24933 6.00067 8 6C7.71667 6 7.47933 5.90833 7.288 5.725C7.09667 5.54167 7.02567 5.325 7.075 5.075C7.30833 3.925 7.88333 2.95833 8.8 2.175C9.71667 1.39167 10.7833 1 12 1C13.3833 1 14.5627 1.48733 15.538 2.462C16.5133 3.43667 17.0007 4.616 17 6V8H18C18.55 8 19.021 8.196 19.413 8.588C19.805 8.98 20.0007 9.45067 20 10V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.021 16.8043 13.413 16.413C13.805 16.0217 14.0007 15.5507 14 15C13.9993 14.4493 13.8037 13.9787 13.413 13.588C13.0223 13.1973 12.5513 13.0013 12 13C11.4487 12.9987 10.978 13.1947 10.588 13.588C10.198 13.9813 10.002 14.452 10 15C9.998 15.548 10.194 16.019 10.588 16.413C10.982 16.807 11.4527 17.0027 12 17Z"
      fill={fill}
    />
  </svg>
);

// 잠금 아이콘
const LockIcon = ({ className = '', width = 24, height = 24, fill = 'black' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V10C4 9.45 4.196 8.97933 4.588 8.588C4.98 8.19667 5.45067 8.00067 6 8H7V6C7 4.61667 7.48767 3.43767 8.463 2.463C9.43833 1.48833 10.6173 1.00067 12 1C13.3827 0.999334 14.562 1.487 15.538 2.463C16.514 3.439 17.0013 4.618 17 6V8H18C18.55 8 19.021 8.196 19.413 8.588C19.805 8.98 20.0007 9.45067 20 10V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.021 16.8043 13.413 16.413C13.805 16.0217 14.0007 15.5507 14 15C13.9993 14.4493 13.8037 13.9787 13.413 13.588C13.0223 13.1973 12.5513 13.0013 12 13C11.4487 12.9987 10.978 13.1947 10.588 13.588C10.198 13.9813 10.002 14.452 10 15C9.998 15.548 10.194 16.019 10.588 16.413C10.982 16.807 11.4527 17.0027 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z"
      fill={fill}
    />
  </svg>
);

// 잠금 키 아이콘
const LockKeyIcon = ({ className = '', width = 24, height = 24, fill = 'black' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.5 7.125H16.875V5.25C16.875 3.95707 16.3614 2.71709 15.4471 1.80285C14.5329 0.888615 13.2929 0.375 12 0.375C10.7071 0.375 9.46709 0.888615 8.55285 1.80285C7.63861 2.71709 7.125 3.95707 7.125 5.25V7.125H4.5C4.00272 7.125 3.52581 7.32254 3.17417 7.67417C2.82254 8.02581 2.625 8.50272 2.625 9V19.5C2.625 19.9973 2.82254 20.4742 3.17417 20.8258C3.52581 21.1775 4.00272 21.375 4.5 21.375H19.5C19.9973 21.375 20.4742 21.1775 20.8258 20.8258C21.1775 20.4742 21.375 19.9973 21.375 19.5V9C21.375 8.50272 21.1775 8.02581 20.8258 7.67417C20.4742 7.32254 19.9973 7.125 19.5 7.125ZM9.375 5.25C9.375 4.55381 9.65156 3.88613 10.1438 3.39384C10.6361 2.90156 11.3038 2.625 12 2.625C12.6962 2.625 13.3639 2.90156 13.8562 3.39384C14.3484 3.88613 14.625 4.55381 14.625 5.25V7.125H9.375V5.25ZM19.125 19.125H4.875V9.375H19.125V19.125ZM12 10.5C11.304 10.5003 10.6297 10.7425 10.0927 11.1853C9.55569 11.628 9.18932 12.2437 9.05636 12.9269C8.9234 13.6101 9.03212 14.3183 9.36391 14.9301C9.69569 15.5419 10.2299 16.0194 10.875 16.2806V16.875C10.875 17.1734 10.9935 17.4595 11.2045 17.6705C11.4155 17.8815 11.7016 18 12 18C12.2984 18 12.5845 17.8815 12.7955 17.6705C13.0065 17.4595 13.125 17.1734 13.125 16.875V16.2806C13.7701 16.0194 14.3043 15.5419 14.6361 14.9301C14.9679 14.3183 15.0766 13.6101 14.9436 12.9269C14.8107 12.2437 14.4443 11.628 13.9073 11.1853C13.3703 10.7425 12.696 10.5003 12 10.5ZM12 12.75C12.1483 12.75 12.2933 12.794 12.4167 12.8764C12.54 12.9588 12.6361 13.0759 12.6929 13.213C12.7497 13.35 12.7645 13.5008 12.7356 13.6463C12.7066 13.7918 12.6352 13.9254 12.5303 14.0303C12.4254 14.1352 12.2918 14.2066 12.1463 14.2356C12.0008 14.2645 11.85 14.2497 11.713 14.1929C11.5759 14.1361 11.4588 14.04 11.3764 13.9167C11.294 13.7933 11.25 13.6483 11.25 13.5C11.25 13.3011 11.329 13.1103 11.4697 12.9697C11.6103 12.829 11.8011 12.75 12 12.75Z"
      fill={fill}
    />
  </svg>
);

// 체크 아이콘
const CheckIcon = ({ className = '', width = 36, height = 36 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15.3645 24.4707L9 18.1047L11.121 15.9837L15.3645 20.2257L23.8485 11.7402L25.971 13.8627L15.3645 24.4707Z"
      fill="#1EB813"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 18C1.5 8.8875 8.8875 1.5 18 1.5C27.1125 1.5 34.5 8.8875 34.5 18C34.5 27.1125 27.1125 34.5 18 34.5C8.8875 34.5 1.5 27.1125 1.5 18ZM18 31.5C16.2272 31.5 14.4717 31.1508 12.8338 30.4724C11.1959 29.7939 9.70765 28.7995 8.45406 27.5459C7.20047 26.2923 6.20606 24.8041 5.52763 23.1662C4.84919 21.5283 4.5 19.7728 4.5 18C4.5 16.2272 4.84919 14.4717 5.52763 12.8338C6.20606 11.1959 7.20047 9.70765 8.45406 8.45406C9.70765 7.20047 11.1959 6.20606 12.8338 5.52763C14.4717 4.84919 16.2272 4.5 18 4.5C21.5804 4.5 25.0142 5.92232 27.5459 8.45406C30.0777 10.9858 31.5 14.4196 31.5 18C31.5 21.5804 30.0777 25.0142 27.5459 27.5459C25.0142 30.0777 21.5804 31.5 18 31.5Z"
      fill="#1EB813"
    />
  </svg>
);

// 엑스 아이콘
const WrongIcon = ({ className = '', width = 36, height = 36 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M24.4707 25.4707L18.1047 19.1047L11.7402 25.4707L9.61725 23.3477L15.9837 16.9837L9.61725 10.6173L11.7402 8.49425L18.1047 14.8627L24.4707 8.49425L26.5937 10.6173L20.2257 16.9837L26.5937 23.3477L24.4707 25.4707Z"
      fill="#FF5C38"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 18C1.5 8.8875 8.8875 1.5 18 1.5C27.1125 1.5 34.5 8.8875 34.5 18C34.5 27.1125 27.1125 34.5 18 34.5C8.8875 34.5 1.5 27.1125 1.5 18ZM18 31.5C16.2272 31.5 14.4717 31.1508 12.8338 30.4724C11.1959 29.7939 9.70765 28.7995 8.45406 27.5459C7.20047 26.2923 6.20606 24.8041 5.52763 23.1662C4.84919 21.5283 4.5 19.7728 4.5 18C4.5 16.2272 4.84919 14.4717 5.52763 12.8338C6.20606 11.1959 7.20047 9.70765 8.45406 8.45406C9.70765 7.20047 11.1959 6.20606 12.8338 5.52763C14.4717 4.84919 16.2272 4.5 18 4.5C21.5804 4.5 25.0142 5.92232 27.5459 8.45406C30.0777 10.9858 31.5 14.4196 31.5 18C31.5 21.5804 30.0777 25.0142 27.5459 27.5459C25.0142 30.0777 21.5804 31.5 18 31.5Z"
      fill="#FF5C38"
    />
  </svg>
);

// 알림 아이콘
const AlarmIcon = ({ className = '', width = 20, height = 22 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 7C16 5.4087 15.3679 3.88258 14.2426 2.75736C13.1174 1.63214 11.5913 1 10 1C8.4087 1 6.88258 1.63214 5.75736 2.75736C4.63214 3.88258 4 5.4087 4 7C4 14 1 16 1 16H19C19 16 16 14 16 7Z"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
    <path
      d="M11.7256 20C11.5498 20.3031 11.2975 20.5547 10.9939 20.7295C10.6902 20.9044 10.346 20.9965 9.99562 20.9965C9.64525 20.9965 9.30101 20.9044 8.9974 20.7295C8.69378 20.5547 8.44144 20.3031 8.26562 20"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  </svg>
);

// 로고 아이콘
const LogoIcon = ({ className = '', width = 67, height = 73 }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={className}
  >
    <path
      d="M0 0 C10.23 0 20.46 0 31 0 C30.00976564 6.93164051 29.76751958 8.43976388 25 13 C20.30243537 15.80047122 16.53122015 16.52884156 11.21484375 15.7109375 C6.66563833 14.25069872 3.33086428 11.1075654 0.80859375 7.11328125 C0 5 0 5 0 0 Z "
      fill="#FF5B38"
      transform="translate(9,15)"
    />
    <path
      d="M0 0 C4.91036433 4.11100269 5.61918975 6.84013847 6.6875 13.25 C-3.8725 13.25 -14.4325 13.25 -25.3125 13.25 C-22.88514957 3.54059829 -22.88514957 3.54059829 -19.3125 0.25 C-12.6892829 -3.53259288 -6.80467274 -3.59492145 0 0 Z "
      fill="#8F00FF"
      transform="translate(52.3125,43.75)"
    />
    <path
      d="M0 0 C3.80668295 1.53481294 5.8962489 3.86522081 8.5625 6.9375 C12.16935634 11.07412468 12.16935634 11.07412468 16 15 C15.67 15.99 15.34 16.98 15 18 C13.09814453 18.90722656 13.09814453 18.90722656 10.6328125 19.640625 C9.74722656 19.90617187 8.86164062 20.17171875 7.94921875 20.4453125 C7.01722656 20.71085937 6.08523437 20.97640625 5.125 21.25 C4.20074219 21.53101562 3.27648437 21.81203125 2.32421875 22.1015625 C-4.6027751 24.1324083 -4.6027751 24.1324083 -8 23 C-2.85714286 2.85714286 -2.85714286 2.85714286 0 0 Z "
      fill="#22C4F7"
      transform="translate(44,16)"
    />
    <path
      d="M0 0 C-0.64458097 3.08359651 -1.29088443 6.16682955 -1.9375 9.25 C-2.11990234 10.12269531 -2.30230469 10.99539062 -2.49023438 11.89453125 C-2.66748047 12.73886719 -2.84472656 13.58320312 -3.02734375 14.453125 C-3.18968506 15.22817383 -3.35202637 16.00322266 -3.51928711 16.80175781 C-3.97361933 18.87936437 -4.4726508 20.93984981 -5 23 C-9.10084544 22.43770914 -11.45399746 20.23867968 -14.5625 17.625 C-15.51253906 16.83351563 -16.46257813 16.04203125 -17.44140625 15.2265625 C-19.37935136 13.54010645 -21.2248267 11.85287449 -23 10 C-22 7 -22 7 -20.18994141 5.90917969 C-19.03244385 5.42046387 -19.03244385 5.42046387 -17.8515625 4.921875 C-16.59085938 4.38820313 -16.59085938 4.38820313 -15.3046875 3.84375 C-14.42039062 3.4828125 -13.53609375 3.121875 -12.625 2.75 C-11.7484375 2.37359375 -10.871875 1.9971875 -9.96875 1.609375 C-3.38565051 -1.12855017 -3.38565051 -1.12855017 0 0 Z "
      fill="#FFCA10"
      transform="translate(30,33)"
    />
  </svg>
);

// 돋보기 아이콘콘
const ReadingGlassesIcon = ({ className = 'mr-[25px]', width = 25, height = 25 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.1122 2.50785e-08C9.33889 0.000151098 7.59129 0.424367 6.01524 1.23726C4.43918 2.05014 3.08039 3.22813 2.05221 4.67294C1.02403 6.11775 0.356285 7.78748 0.104687 9.54282C-0.146912 11.2982 0.0249307 13.0882 0.605877 14.7637C1.18682 16.4391 2.16003 17.9513 3.4443 19.1741C4.72856 20.397 6.28665 21.295 7.98857 21.7932C9.69049 22.2914 11.4869 22.3755 13.2279 22.0383C14.9689 21.7011 16.604 20.9524 17.9968 19.8548L22.7749 24.6327C23.0217 24.8711 23.3522 25.0029 23.6952 25C24.0382 24.997 24.3664 24.8594 24.609 24.6168C24.8516 24.3742 24.9892 24.0461 24.9921 23.7031C24.9951 23.36 24.8632 23.0296 24.6249 22.7828L19.8468 18.0049C21.1395 16.3651 21.9443 14.3945 22.1693 12.3186C22.3942 10.2428 22.0302 8.14553 21.1188 6.2669C20.2075 4.38827 18.7856 2.80416 17.0159 1.69586C15.2463 0.587568 13.2003 -0.000140176 11.1122 2.50785e-08ZM2.60795 11.1206C2.60795 8.86519 3.50393 6.70217 5.0988 5.10736C6.69366 3.51256 8.85676 2.61661 11.1122 2.61661C13.3677 2.61661 15.5308 3.51256 17.1257 5.10736C18.7206 6.70217 19.6165 8.86519 19.6165 11.1206C19.6165 13.376 18.7206 15.539 17.1257 17.1338C15.5308 18.7286 13.3677 19.6246 11.1122 19.6246C8.85676 19.6246 6.69366 18.7286 5.0988 17.1338C3.50393 15.539 2.60795 13.376 2.60795 11.1206Z"
      fill="#C2C2C2"
    />
  </svg>
);
const StarReviewIcon = ({
  className = '',
  width = 35,
  height = 33,
  stroke = '#FF5353',
  fill = '#FF5353',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 37 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18.5 1L23.9075 11.8612L36 13.6136L27.25 22.0631L29.315 34L18.5 28.3612L7.685 34L9.75 22.0631L1 13.6136L13.0925 11.8612L18.5 1Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
// 1레벨 뱃지
const LeveloneBadgeIcon = ({ className = '', width = 35, height = 33 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6.05911 15V13.67H6.51724V10.33H6L6.32512 9H8.52709V13.67H9V15H6.05911Z"
      fill="black"
    />
    <path
      d="M3.16406 26.0007L7.49739 24.0007L11.8307 26.0007V16.4727C10.6401 17.4583 9.09664 18.0025 7.49739 18.0007C5.89814 18.0025 4.35467 17.4583 3.16406 16.4727V26.0007Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 12C14.001 12.8443 13.8085 13.6793 13.435 14.45C13.0616 15.2207 12.5158 15.9098 11.8333 16.472C10.6427 17.4576 9.09925 18.0018 7.5 18C5.90075 18.0018 4.35728 17.4576 3.16667 16.472C2.48423 15.9098 1.93837 15.2207 1.56495 14.45C1.19153 13.6793 0.998999 12.8443 1 12C1 8.6865 3.91038 6 7.5 6C11.0896 6 14 8.6865 14 12Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.83828 2.32112L9.67537 2.39428C9.38152 2.526 9.02609 2.57139 8.68529 2.52071C8.34448 2.47004 8.04543 2.32734 7.85224 2.1232L7.50022 1.75114L7.1482 2.1232C6.95501 2.32734 6.65596 2.47004 6.31516 2.52071C5.97435 2.57139 5.61893 2.526 5.32508 2.39428L5.16216 2.32112L5.52128 3.2816H9.47916L9.83828 2.32112ZM4.68318 1.36501C4.34226 1.21243 3.91256 1.43348 4.01555 1.70862L4.74977 3.67399C4.77475 3.7407 4.83035 3.79971 4.90791 3.84184C4.98547 3.88397 5.08064 3.90685 5.17859 3.90692H9.82097C9.91899 3.90692 10.0143 3.88408 10.0919 3.84194C10.1696 3.7998 10.2252 3.74075 10.2502 3.67399L10.9845 1.70862C11.0874 1.43348 10.6577 1.21243 10.3168 1.36501L9.19817 1.86651C9.10022 1.91042 8.98174 1.92555 8.86814 1.90866C8.75454 1.89176 8.65485 1.8442 8.59046 1.77615L7.86911 1.0142C7.82857 0.971382 7.77365 0.936272 7.70922 0.911989C7.64479 0.887705 7.57285 0.875 7.49978 0.875C7.4267 0.875 7.35476 0.887705 7.29033 0.911989C7.22591 0.936272 7.17099 0.971382 7.13045 1.0142L6.40954 1.77615C6.34521 1.84425 6.24556 1.89188 6.13196 1.90883C6.01835 1.92578 5.89984 1.9107 5.80183 1.86682L4.68318 1.36501Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.04688 4.29703C5.04688 4.21411 5.09364 4.13459 5.17689 4.07595C5.26014 4.01732 5.37305 3.98438 5.49078 3.98438H9.59737C9.7151 3.98438 9.82801 4.01732 9.91126 4.07595C9.99451 4.13459 10.0413 4.21411 10.0413 4.29703C10.0413 4.37996 9.99451 4.45948 9.91126 4.51812C9.82801 4.57675 9.7151 4.60969 9.59737 4.60969H5.49078C5.37305 4.60969 5.26014 4.57675 5.17689 4.51812C5.09364 4.45948 5.04688 4.37996 5.04688 4.29703Z"
      fill="black"
    />
    <path
      d="M3.5 1C3.56917 1 3.63417 0.986866 3.695 0.9606C3.75583 0.934333 3.80875 0.898716 3.85375 0.85375C3.89875 0.808783 3.93437 0.755866 3.9606 0.695C3.98683 0.634133 3.99997 0.569133 4 0.5C4.00003 0.430867 3.9869 0.365867 3.9606 0.305C3.9343 0.244133 3.89868 0.191217 3.85375 0.14625C3.80882 0.101283 3.7559 0.0656667 3.695 0.0394C3.6341 0.0131333 3.5691 0 3.5 0C3.4309 0 3.3659 0.0131333 3.305 0.0394C3.2441 0.0656667 3.19118 0.101283 3.14625 0.14625C3.10132 0.191217 3.06568 0.244133 3.03935 0.305C3.01302 0.365867 2.9999 0.430867 3 0.5C3.0001 0.569133 3.01323 0.634133 3.0394 0.695C3.06557 0.755866 3.10118 0.808783 3.14625 0.85375C3.19132 0.898716 3.24423 0.93435 3.305 0.96065C3.36577 0.98695 3.43077 1.00007 3.5 1Z"
      fill="black"
    />
  </svg>
);

// 3레벨 벳지
const LevelthirdBadgeIcon = ({ className = '', width = 35, height = 33 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.16406 27.0007L7.49739 25.0007L11.8307 27.0007V17.4727C10.6401 18.4583 9.09664 19.0025 7.49739 19.0007C5.89814 19.0025 4.35467 18.4583 3.16406 17.4727V27.0007Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 13C14.001 13.8443 13.8085 14.6793 13.435 15.45C13.0616 16.2207 12.5158 16.9098 11.8333 17.472C10.6427 18.4576 9.09925 19.0018 7.5 19C5.90075 19.0018 4.35728 18.4576 3.16667 17.472C2.48423 16.9098 1.93837 16.2207 1.56495 15.45C1.19153 14.6793 0.998999 13.8443 1 13C1 9.6865 3.91038 7 7.5 7C11.0896 7 14 9.6865 14 13Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 10H8.2397C8.76405 10 9.18851 10.0867 9.51311 10.26C9.8377 10.4267 10 10.65 10 10.93V15.07C10 15.35 9.8377 15.5767 9.51311 15.75C9.18851 15.9167 8.76405 16 8.2397 16H5V14.67H7.35955C7.42197 14.67 7.45318 14.6533 7.45318 14.62V13.61H5.5618V12.28H7.45318V11.38C7.45318 11.3467 7.42197 11.33 7.35955 11.33H5V10Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.83828 3.32112L9.67537 3.39428C9.38152 3.526 9.02609 3.57139 8.68529 3.52071C8.34448 3.47004 8.04543 3.32734 7.85224 3.1232L7.50022 2.75114L7.1482 3.1232C6.95501 3.32734 6.65596 3.47004 6.31516 3.52071C5.97435 3.57139 5.61893 3.526 5.32508 3.39428L5.16216 3.32112L5.52128 4.2816H9.47916L9.83828 3.32112ZM4.68318 2.36501C4.34226 2.21243 3.91256 2.43348 4.01555 2.70862L4.74977 4.67399C4.77475 4.7407 4.83035 4.79971 4.90791 4.84184C4.98547 4.88397 5.08064 4.90685 5.17859 4.90692H9.82097C9.91899 4.90692 10.0143 4.88408 10.0919 4.84194C10.1696 4.7998 10.2252 4.74075 10.2502 4.67399L10.9845 2.70862C11.0874 2.43348 10.6577 2.21243 10.3168 2.36501L9.19817 2.86651C9.10022 2.91042 8.98174 2.92555 8.86814 2.90866C8.75454 2.89176 8.65485 2.8442 8.59046 2.77615L7.86911 2.0142C7.82857 1.97138 7.77365 1.93627 7.70922 1.91199C7.64479 1.88771 7.57285 1.875 7.49978 1.875C7.4267 1.875 7.35476 1.88771 7.29033 1.91199C7.22591 1.93627 7.17099 1.97138 7.13045 2.0142L6.40954 2.77615C6.34521 2.84425 6.24556 2.89188 6.13196 2.90883C6.01835 2.92578 5.89984 2.9107 5.80183 2.86682L4.68318 2.36501Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.04688 5.29703C5.04688 5.21411 5.09364 5.13459 5.17689 5.07595C5.26014 5.01732 5.37305 4.98438 5.49078 4.98438H9.59737C9.7151 4.98438 9.82801 5.01732 9.91126 5.07595C9.99451 5.13459 10.0413 5.21411 10.0413 5.29703C10.0413 5.37996 9.99451 5.45948 9.91126 5.51812C9.82801 5.57675 9.7151 5.60969 9.59737 5.60969H5.49078C5.37305 5.60969 5.26014 5.57675 5.17689 5.51812C5.09364 5.45948 5.04688 5.37996 5.04688 5.29703Z"
      fill="black"
    />
    <path
      d="M3.5 2C3.56917 2 3.63417 1.98687 3.695 1.9606C3.75583 1.93433 3.80875 1.89872 3.85375 1.85375C3.89875 1.80878 3.93437 1.75587 3.9606 1.695C3.98683 1.63413 3.99997 1.56913 4 1.5C4.00003 1.43087 3.9869 1.36587 3.9606 1.305C3.9343 1.24413 3.89868 1.19122 3.85375 1.14625C3.80882 1.10128 3.7559 1.06567 3.695 1.0394C3.6341 1.01313 3.5691 1 3.5 1C3.4309 1 3.3659 1.01313 3.305 1.0394C3.2441 1.06567 3.19118 1.10128 3.14625 1.14625C3.10132 1.19122 3.06568 1.24413 3.03935 1.305C3.01302 1.36587 2.9999 1.43087 3 1.5C3.0001 1.56913 3.01323 1.63413 3.0394 1.695C3.06557 1.75587 3.10118 1.80878 3.14625 1.85375C3.19132 1.89872 3.24423 1.93435 3.305 1.96065C3.36577 1.98695 3.43077 2.00007 3.5 2Z"
      fill="black"
    />
    <path
      d="M7.5 1C7.56917 1 7.63417 0.986866 7.695 0.9606C7.75583 0.934333 7.80875 0.898716 7.85375 0.85375C7.89875 0.808783 7.93437 0.755866 7.9606 0.695C7.98683 0.634133 7.99997 0.569133 8 0.5C8.00003 0.430867 7.9869 0.365867 7.9606 0.305C7.9343 0.244133 7.89868 0.191217 7.85375 0.14625C7.80882 0.101283 7.7559 0.0656667 7.695 0.0394C7.6341 0.0131333 7.5691 0 7.5 0C7.4309 0 7.3659 0.0131333 7.305 0.0394C7.2441 0.0656667 7.19118 0.101283 7.14625 0.14625C7.10132 0.191217 7.06568 0.244133 7.03935 0.305C7.01302 0.365867 6.9999 0.430867 7 0.5C7.0001 0.569133 7.01323 0.634133 7.0394 0.695C7.06557 0.755866 7.10118 0.808783 7.14625 0.85375C7.19132 0.898716 7.24423 0.93435 7.305 0.96065C7.36577 0.98695 7.43077 1.00007 7.5 1Z"
      fill="black"
    />
    <path
      d="M11.5 2C11.5692 2 11.6342 1.98687 11.695 1.9606C11.7558 1.93433 11.8088 1.89872 11.8538 1.85375C11.8987 1.80878 11.9344 1.75587 11.9606 1.695C11.9868 1.63413 12 1.56913 12 1.5C12 1.43087 11.9869 1.36587 11.9606 1.305C11.9343 1.24413 11.8987 1.19122 11.8538 1.14625C11.8088 1.10128 11.7559 1.06567 11.695 1.0394C11.6341 1.01313 11.5691 1 11.5 1C11.4309 1 11.3659 1.01313 11.305 1.0394C11.2441 1.06567 11.1912 1.10128 11.1463 1.14625C11.1013 1.19122 11.0657 1.24413 11.0394 1.305C11.013 1.36587 10.9999 1.43087 11 1.5C11.0001 1.56913 11.0132 1.63413 11.0394 1.695C11.0656 1.75587 11.1012 1.80878 11.1463 1.85375C11.1913 1.89872 11.2442 1.93435 11.305 1.96065C11.3658 1.98695 11.4308 2.00007 11.5 2Z"
      fill="black"
    />
  </svg>
);

// 2레벨 뱃지
const LeveltwoBadgeIcon = ({ className = '', width = 35, height = 33 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.16406 27.0007L7.49739 25.0007L11.8307 27.0007V17.4727C10.6401 18.4583 9.09664 19.0025 7.49739 19.0007C5.89814 19.0025 4.35467 18.4583 3.16406 17.4727V27.0007Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 13C14.001 13.8443 13.8085 14.6793 13.435 15.45C13.0616 16.2207 12.5158 16.9098 11.8333 17.472C10.6427 18.4576 9.09925 19.0018 7.5 19C5.90075 19.0018 4.35728 18.4576 3.16667 17.472C2.48423 16.9098 1.93837 16.2207 1.56495 15.45C1.19153 14.6793 0.998999 13.8443 1 13C1 9.6865 3.91038 7 7.5 7C11.0896 7 14 9.6865 14 13Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5 13.22C5 12.94 5.1623 12.7167 5.48689 12.55C5.81149 12.3767 6.23596 12.29 6.7603 12.29H7.35955C7.42197 12.29 7.45318 12.2733 7.45318 12.24V11.38C7.45318 11.3467 7.42197 11.33 7.35955 11.33H5V10H8.2397C8.76405 10 9.18851 10.0867 9.51311 10.26C9.8377 10.4267 10 10.65 10 10.93V12.69C10 12.97 9.8377 13.1967 9.51311 13.37C9.18851 13.5367 8.76405 13.62 8.2397 13.62H7.64045C7.57803 13.62 7.54682 13.6367 7.54682 13.67V14.67H10V16H5V13.22Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.83828 3.32112L9.67537 3.39428C9.38152 3.526 9.02609 3.57139 8.68529 3.52071C8.34448 3.47004 8.04543 3.32734 7.85224 3.1232L7.50022 2.75114L7.1482 3.1232C6.95501 3.32734 6.65596 3.47004 6.31516 3.52071C5.97435 3.57139 5.61893 3.526 5.32508 3.39428L5.16216 3.32112L5.52128 4.2816H9.47916L9.83828 3.32112ZM4.68318 2.36501C4.34226 2.21243 3.91256 2.43348 4.01555 2.70862L4.74977 4.67399C4.77475 4.7407 4.83035 4.79971 4.90791 4.84184C4.98547 4.88397 5.08064 4.90685 5.17859 4.90692H9.82097C9.91899 4.90692 10.0143 4.88408 10.0919 4.84194C10.1696 4.7998 10.2252 4.74075 10.2502 4.67399L10.9845 2.70862C11.0874 2.43348 10.6577 2.21243 10.3168 2.36501L9.19817 2.86651C9.10022 2.91042 8.98174 2.92555 8.86814 2.90866C8.75454 2.89176 8.65485 2.8442 8.59046 2.77615L7.86911 2.0142C7.82857 1.97138 7.77365 1.93627 7.70922 1.91199C7.64479 1.88771 7.57285 1.875 7.49978 1.875C7.4267 1.875 7.35476 1.88771 7.29033 1.91199C7.22591 1.93627 7.17099 1.97138 7.13045 2.0142L6.40954 2.77615C6.34521 2.84425 6.24556 2.89188 6.13196 2.90883C6.01835 2.92578 5.89984 2.9107 5.80183 2.86682L4.68318 2.36501Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.04688 5.29703C5.04688 5.21411 5.09364 5.13459 5.17689 5.07595C5.26014 5.01732 5.37305 4.98438 5.49078 4.98438H9.59737C9.7151 4.98438 9.82801 5.01732 9.91126 5.07595C9.99451 5.13459 10.0413 5.21411 10.0413 5.29703C10.0413 5.37996 9.99451 5.45948 9.91126 5.51812C9.82801 5.57675 9.7151 5.60969 9.59737 5.60969H5.49078C5.37305 5.60969 5.26014 5.57675 5.17689 5.51812C5.09364 5.45948 5.04688 5.37996 5.04688 5.29703Z"
      fill="black"
    />
    <path
      d="M3.5 2C3.56917 2 3.63417 1.98687 3.695 1.9606C3.75583 1.93433 3.80875 1.89872 3.85375 1.85375C3.89875 1.80878 3.93437 1.75587 3.9606 1.695C3.98683 1.63413 3.99997 1.56913 4 1.5C4.00003 1.43087 3.9869 1.36587 3.9606 1.305C3.9343 1.24413 3.89868 1.19122 3.85375 1.14625C3.80882 1.10128 3.7559 1.06567 3.695 1.0394C3.6341 1.01313 3.5691 1 3.5 1C3.4309 1 3.3659 1.01313 3.305 1.0394C3.2441 1.06567 3.19118 1.10128 3.14625 1.14625C3.10132 1.19122 3.06568 1.24413 3.03935 1.305C3.01302 1.36587 2.9999 1.43087 3 1.5C3.0001 1.56913 3.01323 1.63413 3.0394 1.695C3.06557 1.75587 3.10118 1.80878 3.14625 1.85375C3.19132 1.89872 3.24423 1.93435 3.305 1.96065C3.36577 1.98695 3.43077 2.00007 3.5 2Z"
      fill="black"
    />
    <path
      d="M7.5 1C7.56917 1 7.63417 0.986866 7.695 0.9606C7.75583 0.934333 7.80875 0.898716 7.85375 0.85375C7.89875 0.808783 7.93437 0.755866 7.9606 0.695C7.98683 0.634133 7.99997 0.569133 8 0.5C8.00003 0.430867 7.9869 0.365867 7.9606 0.305C7.9343 0.244133 7.89868 0.191217 7.85375 0.14625C7.80882 0.101283 7.7559 0.0656667 7.695 0.0394C7.6341 0.0131333 7.5691 0 7.5 0C7.4309 0 7.3659 0.0131333 7.305 0.0394C7.2441 0.0656667 7.19118 0.101283 7.14625 0.14625C7.10132 0.191217 7.06568 0.244133 7.03935 0.305C7.01302 0.365867 6.9999 0.430867 7 0.5C7.0001 0.569133 7.01323 0.634133 7.0394 0.695C7.06557 0.755866 7.10118 0.808783 7.14625 0.85375C7.19132 0.898716 7.24423 0.93435 7.305 0.96065C7.36577 0.98695 7.43077 1.00007 7.5 1Z"
      fill="black"
    />
  </svg>
);

const PlayingIcon = ({ className = '', width = 24, height = 24, fill = 'white' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21.409 9.35331C21.8893 9.60872 22.291 9.99 22.5712 10.4563C22.8514 10.9226 22.9994 11.4563 22.9994 12.0003C22.9994 12.5443 22.8514 13.078 22.5712 13.5443C22.291 14.0106 21.8893 14.3919 21.409 14.6473L8.597 21.6143C6.534 22.7373 4 21.2773 4 18.9683V5.03331C4 2.72331 6.534 1.26431 8.597 2.38531L21.409 9.35331Z"
      fill={fill}
    />
  </svg>
);

const StopIcon = ({ className = '', width = 15, height = 19, stroke = 'white' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 18L7.5 13.2778L1 18V2.88889C1 2.38792 1.19566 1.90748 1.54394 1.55324C1.89223 1.19901 2.3646 1 2.85714 1H12.1429C12.6354 1 13.1078 1.19901 13.4561 1.55324C13.8043 1.90748 14 2.38792 14 2.88889V18Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export {
  AlarmIcon,
  CheckIcon,
  DefaultBadgeIcon,
  FavoriteIcon,
  InstructorIcon,
  LeveloneBadgeIcon,
  LevelthirdBadgeIcon,
  LeveltwoBadgeIcon,
  LockIcon,
  LockKeyIcon,
  LockOpenIcon,
  LoginHi,
  LogoIcon,
  PlayingIcon,
  ReadingGlassesIcon,
  StarReviewIcon,
  StatisticsIcon,
  StopIcon,
  StudentIcon,
  SubscribeIcon,
  WrongIcon,
};
