import ResumePreview from "./ResumePreview";

export function PreviewTab({
  form,
  DefaultData,
  activeTmpl,
  ActiveLayout,
  previewRef,
}: any) {

  const data =
    form.name !== ""
      ? form
      : DefaultData;

  return (
    <ResumePreview
      data={data}
      activeTmpl={activeTmpl}
      ActiveLayout={ActiveLayout}
      previewRef={previewRef}
    />
  );
}