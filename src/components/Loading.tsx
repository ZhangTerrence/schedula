import { ThreeDots } from "react-loader-spinner";

export const Loading = ({ loading }: { loading: boolean }) => {
  return (
    <div className={"absolute inset-0 m-auto h-fit w-fit"}>
      <ThreeDots
        height="80"
        width="80"
        radius="10"
        color="var(--color--negative)"
        ariaLabel="three-dots-loading"
        wrapperClass={"h-fit w-fit"}
        visible={loading}
      />
    </div>
  );
};
