type IFolderName = 'image' | 'media' | 'doc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSingleFilePath = (
  files: any,
  folderName: IFolderName,
): string | undefined => {
  const fileField = files?.[folderName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    return fileField[0].location || fileField[0].path || `/${folderName}/${fileField[0].filename}`;
  }

  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMultipleFilesPath = (
  files: any,
  folderName: IFolderName,
): string[] | undefined => {
  const folderFiles = files?.[folderName];
  if (folderFiles && Array.isArray(folderFiles)) {
    return folderFiles.map((file: any) => file.location || file.path || `/${folderName}/${file.filename}`);
  }

  return undefined;
};
