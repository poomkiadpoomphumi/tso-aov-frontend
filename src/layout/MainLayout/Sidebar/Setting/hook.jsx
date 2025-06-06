import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { allmail } from '../../../../config';
const Root = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
  font-size: 14px;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 300px;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px 4px; /* Adjust padding as needed */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 30px;
  
  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
    min-width: 100px;
    width: auto; /* Allow width to grow based on content */
  }
`,
);

const Tag = ({ label, onDelete, ...other }) => (
  <div {...other}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
);

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;
    cursor: pointer;
    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;
    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

const CustomizedHook = ({ text, onCcMailChange, value, setValueData }) => {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: selectedValues,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    multiple: true,
    options: allmail,
    value,
    onChange: useCallback((event, newValue) => {
      setValueData(newValue);
      onCcMailChange(newValue);
    }, [onCcMailChange, setValueData]),
    getOptionLabel: useCallback((option) => option.title, []),
    isOptionEqualToValue: (option, value) => option.title === value.title
  });

  const handleOptionClick = useCallback((option) => {
    const newValue = selectedValues.some((selectedOption) => selectedOption.title === option.title)
      ? selectedValues.filter((selectedOption) => selectedOption.title !== option.title)
      : [...selectedValues, option];
    setValueData(newValue);
    onCcMailChange(newValue);
  }, [selectedValues, setValueData, onCcMailChange]);

  const isOptionSelected = useCallback((option) => selectedValues.some((selectedOption) => selectedOption.title === option.title), [selectedValues]);

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()} style={{ fontSize: '14px', fontWeight: 'bold' }}>{text}</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''} >
          {selectedValues.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <StyledTag key={key} {...tagProps} label={option.title} />;
          })}
          <input {...getInputProps()} placeholder={selectedValues.length === 0 ? 'Enter email' : ''} />
        </InputWrapper>
      </div>
      <Listbox {...getListboxProps()}>
        {groupedOptions.map((option, index) => {
          const { key, ...optionProps } = getOptionProps({ option, index });
          return index === 0 ? (<li key={key} sx={{ color: '#fafafa' }}>{allmail[0].title}</li>) :
            (
              <li
                key={key}
                {...optionProps}
                onClick={() => handleOptionClick(option)}
              >
                <span>{option.title}</span>
                {isOptionSelected(option) && <CheckIcon fontSize="small" />}
              </li>
            );
        })}
      </Listbox>
    </Root>
  );
};

CustomizedHook.propTypes = {
  onCcMailChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
  setValueData: PropTypes.func.isRequired,
};

export default CustomizedHook;
