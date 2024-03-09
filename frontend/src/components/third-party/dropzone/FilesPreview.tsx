// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemText, ListItem, CircularProgress } from '@mui/material';

// project-imports
import IconButton from 'components/@extended/IconButton';

// utils
// type
import { DropzopType, FilePreviewProps } from 'types/dropzone';

// assets
import { CloseCircle, Document } from 'iconsax-react';

// ==============================|| MULTI UPLOAD - PREVIEW ||============================== //

function getDropzoneData(file: any | string, index?: number) {
  if (typeof file === 'string') {
    return {
      key: index ? `${file}-${index}` : file,
      preview: file
    };
  }

  return {
    key: index ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate
  };
}

export default function FilesPreview({ files, onRemove, type }: FilePreviewProps) {
  const hasFile = files.length > 0;

  return (
    <List
      disablePadding
      sx={{
        ...(hasFile && type !== DropzopType.standard && { my: 3 }),
        ...(type === DropzopType.standard && { width: 'calc(100% - 84px)' })
      }}
    >
      {files.map((file, index) => {
        const { name, wordsCount, id, status } = file;

        return (
          <ListItem
            key={id}
            sx={{
              my: 1,
              px: 2,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`
            }}
          >
            <Document variant="Bold" style={{ width: '30px', height: '30px', fontSize: '1.15rem', marginRight: 4 }} />

            <ListItemText
              primary={typeof file === 'string' ? file : name}
              secondary={`${wordsCount || 0} Palavras`}
              primaryTypographyProps={{ variant: 'subtitle2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />

            {status === 'loading' ? (
              <CircularProgress key={id} size={20} />
            ) : (
              onRemove && (
                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <CloseCircle variant="Bold" style={{ fontSize: '1.15rem' }} />
                </IconButton>
              )
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
