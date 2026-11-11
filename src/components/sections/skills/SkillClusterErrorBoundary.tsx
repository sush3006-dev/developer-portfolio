import React, { Component, ErrorInfo, ReactNode } from 'react';
import { SkillCategory } from '../../../data/skillsData';
import { ClusterFallback } from './ClusterFallback';

interface Props {
  category: SkillCategory;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SkillClusterErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('SkillClusterErrorBoundary caught a 3D scene error:', error.message, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ClusterFallback category={this.props.category} />;
    }

    return this.props.children;
  }
}

