import {
  Sun, Cloud, CloudSun, CloudDrizzle, CloudRain,
  CloudSnow, CloudFog, CloudLightning
} from "lucide-react";

type Props = { code?: number; className?: string };

export default function WeatherIcon({ code, className = "h-5 w-5" }: Props) {
  const Icon =
    code === 0 ? Sun :
    [1,2,3].includes(code ?? -1) ? CloudSun :
    [45,48].includes(code ?? -1) ? CloudFog :
    [51,53,55,56,57].includes(code ?? -1) ? CloudDrizzle :
    [61,63,65,80,81,82,66,67].includes(code ?? -1) ? CloudRain :
    [71,73,75,77,85,86].includes(code ?? -1) ? CloudSnow :
    [95,96,99].includes(code ?? -1) ? CloudLightning :
    Cloud;

  return <Icon className={className} aria-hidden />;
}