import { Svg, Rect, Path } from "react-native-svg";

type Props = {
  stroke?: string;
  fill?: string;
};

const CalendarIcon = ({ stroke = "#FFF", fill = "#FFF" }: Props) => (
  <Svg viewBox="0 0 51.17572 54.235317" width={50} height={50}>
    <Rect
      x={1.53877}
      y={7.187043}
      width={48.098179}
      height={45.509502}
      ry={7.0306911}
      stroke={stroke}
      strokeWidth={2.5}
      fill="none"
    />
    <Rect x={7.0879} y={21.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={17.0879} y={21.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={27.0879} y={21.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={37.0879} y={21.85144} width={7} height={7} ry={0.55492604} fill={fill} />

    <Rect x={7.0879} y={30.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={17.0879} y={30.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={27.0879} y={30.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={37.0879} y={30.85144} width={7} height={7} ry={0.55492604} fill={fill} />

    <Rect x={7.0879} y={39.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={17.0879} y={39.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={27.0879} y={39.85144} width={7} height={7} ry={0.55492604} fill={fill} />
    <Rect x={37.0879} y={39.85144} width={7} height={7} ry={0.55492604} fill={fill} />

    <Path d="M0.5879,16.85144 h50" stroke={stroke} strokeWidth={2.5} fill="none" />
    <Path
      d="M12.5879,1.75 v9.4"
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M25.5879,1.75 v9.4"
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M38.5879,1.75 v9.4"
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

export default CalendarIcon;
