import Form from "./Form";
import Video from "./Video";
import Map from "./Map";
import TableWithForm from "./TableWithForm";
import Tabs from "./Tabs";
import Detail from "./Detail";
import Chart from "./Chart";
import StepsForm from "./StepsForm";
import CustomCard from "./CustomCard";
import { RGL_LAYOUT_TYPE, ANTD_LAYOUT_TYPE } from "@/agul-utils/constant";
import { CSSProperties } from "react";

const RenderCurrentCard: any = (data: any, layoutType: string) => {
  const Style = {
    position: layoutType === RGL_LAYOUT_TYPE ? "absolute" : "static",
    height: layoutType === RGL_LAYOUT_TYPE ? "100%" : "auto",
  } as CSSProperties;
  const Props = {
    data,
    style: Style,
  };
  if (data?.cardType === "form") {
    return <Form {...Props} />;
  } else if (data?.cardType === "video") {
    return <Video {...Props} />;
  } else if (data?.cardType === "map") {
    return <Map {...Props} />;
  } else if (data?.cardType === "form-table") {
    return <TableWithForm {...Props} />;
  } else if (data?.cardType === "tabs") {
    return <Tabs {...Props} />;
  } else if (data?.cardType === "detail") {
    return <Detail {...Props} />;
  } else if (data?.cardType === "steps-form") {
    return <StepsForm {...Props} />;
  } else if (data?.cardType === "chart") {
    return <Chart {...Props} />;
  } else if (data?.cardType === "custom") {
    return <CustomCard {...Props} />;
  } else {
    return null;
  }
};
export default RenderCurrentCard;
