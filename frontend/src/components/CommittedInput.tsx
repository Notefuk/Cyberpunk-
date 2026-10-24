// Input con commit diferido: guarda una sola vez al salir del campo, con Enter o tras 1,5 s sin escribir (v4.9.7, plan17). [Claude Code · 2026-10-24]
// Reemplazo directo de <input> que se puede usar dentro de bucles .map(), porque encapsula el hook useCommittedField.
import type React from 'react';
import { useCommittedField } from '../hooks/useCommittedField';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'onKeyDown'> & {
  value: string;
  onCommit: (value: string) => void;
  resetKey?: string;
};

export function CommittedInput({ value, onCommit, resetKey, ...rest }: Props) {
  const f = useCommittedField(value, onCommit, { resetKey });
  return <input {...rest} value={f.value} onChange={f.onChange} onBlur={f.onBlur} onKeyDown={f.onKeyDown} />;
}
