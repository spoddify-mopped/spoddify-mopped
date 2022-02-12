import React, {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './InputRange.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const InputRange = (props: Props): React.ReactElement => {
  const setProgressStyles = (color: string) => {
    const min = Number.parseInt(input.current?.min || '0');
    const max = Number.parseInt(input.current?.max || '0');
    const value = Number.parseInt(input.current?.value || '0');

    setStyle({
      background: `linear-gradient(to right, ${color} 0%, ${color} ${
        ((value - min) / (max - min)) * 100
      }%, #535353 ${((value - min) / (max - min)) * 100}%, #535353 100%)`,
    });
  };

  const input = useRef<HTMLInputElement>(null);

  const className = `${styles.range} ${props.className ? props.className : ''}`;

  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (input.current?.matches(':hover')) {
      setProgressStyles('green');
    } else {
      setProgressStyles('#bbbbbb');
    }
  }, [props.value]);

  const onInput: FormEventHandler<HTMLInputElement> = (evt) => {
    setProgressStyles('green');
    props.onInput && props.onInput(evt);
  };

  const onMouseEnter: MouseEventHandler<HTMLInputElement> = (evt) => {
    setProgressStyles('green');
    props.onMouseEnter && props.onMouseEnter(evt);
  };

  const onMouseLeave: MouseEventHandler<HTMLInputElement> = (evt) => {
    setProgressStyles('#bbbbbb');
    props.onMouseLeave && props.onMouseLeave(evt);
  };

  return (
    <input
      {...props}
      className={className}
      type="range"
      ref={input}
      onInput={onInput}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...props.style,
        ...style,
      }}
    />
  );
};

export default InputRange;
