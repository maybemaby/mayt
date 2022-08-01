import { ChangeEvent, useMemo, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import debounce from "lodash/debounce";
import { CommonStyle } from "../lib/types/CommonStyle";
import BaseTextInput from "./common/BaseTextInput";

const expandVert = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

const OuterContainer = styled.div<CommonStyle>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  max-height: 60px;
  z-index: 2;
`;

const Input = styled(BaseTextInput)`
  width: 80%;

  &::after {
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.25),
      -2px 5px 6px rgba(0, 0, 0, 0.25);
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }

  &:focus-within::after {
    opacity: 1;
  }

  &:focus-within {
    width: 90%;
    padding: 10px 22px;
  }
`;

const ResultBox = styled.div`
  border: 1px solid ${(props) => props.theme.color.grey[600]};
  width: 90%;
  margin: 20px auto;
  padding: 20px 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), -2px 3px 4px rgba(0, 0, 0, 0.25);
  animation: ${expandVert} 300ms ease;
  z-index: 2;
  background-color: white;

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
    padding: 5px;
  }
`;

type SearchBoxProps = {
  placeholder?: string;
  commonStyle?: CommonStyle;
  delay?: number;
  loading?: boolean;
  results?: { value: string; label: string }[];
  onSearch(value: string): void;
};

export const SearchBox = ({
  placeholder,
  commonStyle,
  delay,
  loading,
  results,
  onSearch,
}: SearchBoxProps) => {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const onSearchHandler = useMemo(
    () => debounce((value: string) => onSearch(value), delay),
    []
  );

  useEffect(() => {
    return () => {
      onSearchHandler.cancel();
    };
  }, [onSearchHandler]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
    onSearchHandler(e.currentTarget.value);
  };

  return (
    <OuterContainer {...commonStyle}>
      <Input
        type="search"
        placeholder={placeholder ?? "Search"}
        value={inputValue}
        onChange={onChangeHandler}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {inputValue && focused && (
        <ResultBox>
          {results && !loading ? (
            <ul>
              {results.map((res) => (
                <li key={res.value}>{res.label}</li>
              ))}
            </ul>
          ) : (
            "Searching..."
          )}
        </ResultBox>
      )}
    </OuterContainer>
  );
};
