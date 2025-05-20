// Used chatGPT to generate these SVG components from my icons
import { Svg, Path } from "react-native-svg";

type Props = {
  stroke?: string;
};

const ChefsHatIcon = ({ stroke = "#FFF" }: Props) => (
  <Svg width={40} height={50} viewBox="0 0 56.8 70.29">
    <Path
      d="M46.963 125.508c-19.777-8.013-5.836-29.753 5.837-22.123 6.543-10.786 17.396-10.56 21.804-.046 12.256-8.232 26.567 14.359 5.44 22.343 0 0 3.598 28.678 3.72 33.394.122 4.695-40.71 4.97-41.06-.287-.3-4.516 4.26-33.28 4.26-33.28z"
      fill="none"
      fillOpacity={1}
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="butt"
      strokeDasharray="none"
      strokeOpacity={1}
      transform="translate(-35.536 -93.874)"
    />
    <Path
      d="M71.603 137c.464 5.995.763 8.959.525 15.255m-28.673-2.341s6.068 2.75 20.24 2.661c16.316-.1 19.254-2.407 19.254-2.407M54.991 137.04c-1.212 5.807-1.399 15.055-1.399 15.055"
      fill="none"
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray="none"
      strokeOpacity={1}
      transform="translate(-35.536 -93.874)"
    />
    <Path
      d="M63.694 152.575c-.027-3.451.03-6.477.076-9.928"
      fill="none"
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray="none"
      strokeOpacity={1}
      transform="translate(-35.536 -93.874)"
    />
  </Svg>
);
export default ChefsHatIcon;
