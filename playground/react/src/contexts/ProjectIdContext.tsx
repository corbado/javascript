import { FC, PropsWithChildren, createContext, useRef, useState } from 'react';

export enum ProjectIdTypeEnum {
  PasskeyWithEmailOtpFallback,
  PasskeyWithEmailLinkFallback,
  EmailOtpWithPasskeyAppend,
  EmailLinkWithPasskeyAppend,
}

export const ProjectIdContext = createContext<{
  projectId: string;
  projectIdType: ProjectIdTypeEnum;
  updateProjectId: (type: ProjectIdTypeEnum) => void;
}>({
  projectId: '',
  projectIdType: ProjectIdTypeEnum.PasskeyWithEmailOtpFallback,
  updateProjectId: () => {},
});

export const ProjectIdProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectId, setProjectId] = useState<string>(
    process.env.REACT_APP_CORBADO_PROJECT_ID_PasskeyWithEmailOtpFallback!,
  );
  const projectIdType = useRef<ProjectIdTypeEnum>(ProjectIdTypeEnum.PasskeyWithEmailOtpFallback);

  const updateProjectId = (type: ProjectIdTypeEnum) => {
    projectIdType.current = type;
    switch (type) {
      case ProjectIdTypeEnum.PasskeyWithEmailOtpFallback:
        setProjectId(process.env.REACT_APP_CORBADO_PROJECT_ID_PasskeyWithEmailOtpFallback!);
        break;
      case ProjectIdTypeEnum.PasskeyWithEmailLinkFallback:
        setProjectId(process.env.REACT_APP_CORBADO_PROJECT_ID_PasskeyWithEmailLinkFallback!);
        break;
      case ProjectIdTypeEnum.EmailOtpWithPasskeyAppend:
        setProjectId(process.env.REACT_APP_CORBADO_PROJECT_ID_EmailOtpWithPasskeyAppend!);
        break;
      case ProjectIdTypeEnum.EmailLinkWithPasskeyAppend:
        setProjectId(process.env.REACT_APP_CORBADO_PROJECT_ID_EmailLinkWithPasskeyAppend!);
        break;
    }
  };

  return (
    <ProjectIdContext.Provider value={{ projectId, projectIdType: projectIdType.current, updateProjectId }}>
      {children}
    </ProjectIdContext.Provider>
  );
};
