import {
  ChangeEvent,
  useMemo,
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";
import styled, { keyframes } from "styled-components";
import debounce from "lodash/debounce";
import { CommonStyle } from "../lib/types/CommonStyle";
import useOnClickOutside from "@hooks/useOnClickOutside";
import BaseTextInput from "./common/BaseTextInput";
import useEventListener from "@hooks/useEventListener";

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
  align-items: center;
  width: 100%;
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  max-height: 46px;
  z-index: 2;
  position: relative;
`;

const Input = styled(BaseTextInput)`
  width: 80%;

  &::after {
    box-shadow: 0 6px 6px rgba(0, 0, 0, 0.25), -2px 5px 6px rgba(0, 0, 0, 0.25);
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
  position: absolute;
  border: 1px solid ${(props) => props.theme.color.grey[600]};
  margin-top: 60px;
  width: 90%;
  padding: 20px 10px;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25), -2px 3px 4px rgba(0, 0, 0, 0.25);
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

    &:hover {
      cursor: pointer;
      background: ${(props) => props.theme.color.grey[200]};
    }
  }
`;

type SearchBoxProps = {
  placeholder?: string;
  commonStyle?: CommonStyle;
  delay?: number;
  loading?: boolean;
  results?: { value: string; label: string }[];
  onSearch(value: string): void;
  onSelect(value: string): void;
};

export const SearchBox = ({
  placeholder,
  commonStyle,
  delay,
  loading,
  results,
  onSearch,
  onSelect,
}: SearchBoxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLUListElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const onSearchHandler = useMemo(
    () => debounce((value: string) => onSearch(value), delay),
    []
  );

  const handleSelect = useCallback(
    (res: { label: string; value: string }) => {
      onSelect(res.value);
      setFocused(false);
    },
    [setFocused]
  );

  const handleDownKey = useCallback(() => {
    if (results && results.length > 0) {
      // Check results box is rendered and that it contains the active element
      if (
        resultsRef.current &&
        resultsRef.current.contains(document.activeElement)
      ) {
        if (document.activeElement?.nextSibling)
          (document.activeElement.nextSibling as HTMLElement).focus();
      } else if (resultsRef.current) {
        // Focus first result in list if the active element is not in the results box
        (resultsRef.current.firstChild as HTMLElement).focus();
      }
    }
  }, [results]);

  const handleUpKey = useCallback(() => {
    if (results && results.length > 0) {
      if (
        resultsRef.current &&
        resultsRef.current.contains(document.activeElement) &&
        resultsRef.current?.firstChild !== document.activeElement
      ) {
        if (document.activeElement?.previousSibling)
          (document.activeElement.previousSibling as HTMLElement).focus();
      } else if (resultsRef.current?.firstChild === document.activeElement) {
        // Refoucs the input element if pressing up when first result is focused.
        (containerRef.current?.firstChild as HTMLElement).focus();
      }
    }
  }, [results]);

  const handleEnterKey = useCallback(() => {
    if (
      results &&
      resultsRef.current &&
      document.activeElement &&
      resultsRef.current.contains(document.activeElement)
    ) {
      // If contains activeElement, it will have children
      const idx = Array.from(resultsRef.current!.children).indexOf(
        document.activeElement
      );
      handleSelect(results[idx]);
    }
  }, [results, handleSelect]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Escape" || e.key === "Esc") {
        setFocused(false);
      } else if (e.key === "Down" || e.key === "ArrowDown") {
        e.preventDefault();
        handleDownKey();
      } else if (e.key === "Up" || e.key === "ArrowUp") {
        e.preventDefault();
        handleUpKey();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnterKey();
      }
    },
    [handleDownKey, handleEnterKey, handleUpKey]
  );

  useEventListener("keydown", handleKeyDown);

  useOnClickOutside(containerRef as RefObject<HTMLElement>, () => {
    setFocused(false);
  });

  useEffect(() => {
    return () => {
      // Debounce cancel
      onSearchHandler.cancel();
    };
  }, [onSearchHandler]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
    onSearchHandler(e.currentTarget.value);
  };

  return (
    <OuterContainer {...commonStyle} ref={containerRef}>
      <Input
        type="search"
        placeholder={placeholder ?? "Search"}
        value={inputValue}
        onChange={onChangeHandler}
        onFocus={() => setFocused(true)}
      />
      {inputValue && focused && (
        <ResultBox>
          {results && !loading ? (
            <ul ref={resultsRef}>
              {results.map((res) => (
                <li
                  key={res.value}
                  onClick={() => handleSelect(res)}
                  tabIndex={-1}
                >
                  {res.label}
                </li>
              ))}
            </ul>
          ) : (
            "Searching..."
          )}
          {results && results.length === 0 && focused && (
            <div>No results found</div>
          )}
        </ResultBox>
      )}
    </OuterContainer>
  );
};
