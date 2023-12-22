import ReactTestRender from "react-test-renderer";
import { useCallback, useEffect } from "react";
import { useSuspenseRender } from "./hooks";
import { SuspenseRenderProvider } from "./providers";

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("`useSuspenseRender` Testing", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renderSuccess", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderError", async () => {
    const TestComponent = () => {
      const asyncErrorTask = useCallback(
        async () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Err")), 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string, Error>();
      useEffect(() => {
        runTask(async () => {
          await asyncErrorTask();
          return "Aaa";
        }).catch(() => {});
      }, [asyncErrorTask, runTask]);
      return suspenseRender(
        (data) => <p>Success({data})</p>,
        <p>Loading</p>,
        (e) => <p>Error({e.message})</p>,
      );
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error(Err)");
    });
  });
  it("renderSuccess(with provider)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        renderSuccess={<p>Success(Provider)</p>}
        renderLoading={<p>Loading(Provider)</p>}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    // The provider is used because the component does not have its own render function.
    expect(state1.children?.join("")).toEqual("Loading(Provider)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // The provider is not used because the component has its own render function.
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderError(with provider)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Err")), 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        }).catch(() => {});
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        renderError={<p>Error(Provider)</p>}
        renderLoading={<p>Loading(Provider)</p>}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    // The provider is used because the component does not have its own render function.
    expect(state1.children?.join("")).toEqual("Loading(Provider)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // The provider is not used because the component has its own render function.
      expect(state2.children?.join("")).toEqual("Error(Provider)");
    });
  });
  it("renderSuccess(with defaultData)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>({
        defaultData: "DefaultData",
      });
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Success(DefaultData)");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
    });
  });
  it("renderSuccess(single taskRunnerInterceptor)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        experimentals={{
          taskRunnerInterceptors: [
            async () => {
              return "Bbb";
            },
          ],
        }}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
    });
  });
  it("renderSuccess(single taskRunnerInterceptor with re-load data)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender(
        (data) => (
          <button
            type="button"
            onClick={() => {
              runTask(async () => {
                await task();
                return "Reloaded";
              });
            }}
          >
            Success({data})
          </button>
        ),
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        experimentals={{
          taskRunnerInterceptors: [
            async () => {
              await delay(100);
              return "Bbb";
            },
          ],
        }}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
      // state2.props.onClick();
      // const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // expect(state3.children?.join("")).toEqual("Loading");
      // await delay(100 * 2);
      // const state4 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      // expect(state4.children?.join("")).toEqual("Success(Bbb)");
    });
  });
  it("renderSuccess(multiple taskRunnerInterceptors)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender((data) => <p>Success({data})</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(
      <SuspenseRenderProvider
        experimentals={{
          taskRunnerInterceptors: [
            async () => {
              return "B";
            },
            async (prev) => {
              return `${prev}b`;
            },
            async (prev) => {
              return `${prev}b`;
            },
          ],
        }}
      >
        <TestComponent />
      </SuspenseRenderProvider>,
    );
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Bbb)");
    });
  });
  it("Asynchronous `taskRunner` error", async () => {
    const TestComponent = () => {
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          throw new Error("Error");
        }).catch(() => {});
      }, [runTask]);
      return suspenseRender(<p>Success</p>, <p>Loading</p>, <p>Error</p>);
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Error");
    });
  });
  it("renderSuccess(prevData)", async () => {
    const TestComponent = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>();
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                runTask(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const component = ReactTestRender.create(<TestComponent />);
    const state1 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(state1.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const state2 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state2.children?.join("")).toEqual("Success(Aaa)");
      state2.props.onClick();
      await delay(100 * 2);
      const state3 = component.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(state3.children?.join("")).toEqual("Success(Bbb, Aaa)");
    });
  });
  it("shared data", async () => {
    const TestComponentA = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>(undefined, "share1");
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                runTask(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [suspenseRender] = useSuspenseRender<string>(undefined, "share1");
      return suspenseRender(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentB = ReactTestRender.create(<TestComponentB />);
    const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(componentAState.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
    });
  });
  it("shared data(after the status processing is updated, create a hook)", async () => {
    const TestComponentA = () => {
      const task = useCallback(
        async () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          }),
        [],
      );
      const [suspenseRender, runTask] = useSuspenseRender<string>(undefined, "share2");
      useEffect(() => {
        runTask(async () => {
          await task();
          return "Aaa";
        });
      }, [task, runTask]);
      return suspenseRender(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                runTask(async () => {
                  await task();
                  return "Bbb";
                });
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [suspenseRender] = useSuspenseRender<string>(undefined, "share2");
      return suspenseRender(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(componentAState.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
      const componentB = ReactTestRender.create(<TestComponentB />);
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Success(Bbb, Aaa)");
    });
  });
  it("shared error data", async () => {
    const TestComponentA = () => {
      const [suspenseRender, runTask] = useSuspenseRender<string>(undefined, "share error 1");
      useEffect(() => {
        runTask(async () => {
          return "Aaa";
        });
      }, [runTask]);
      return suspenseRender(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                runTask(async () => {
                  throw new Error("Error!");
                }).catch(() => {});
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const TestComponentB = () => {
      const [suspenseRender] = useSuspenseRender<string>(undefined, "share error 1");
      return suspenseRender(
        (data, prevData) => {
          return (
            <button type="button">
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        <p>Error</p>,
      );
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentB = ReactTestRender.create(<TestComponentB />);
    const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(componentAState.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Error");
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Error");
    });
  });
  it("shared error data(after the status processing is updated, create a hook)", async () => {
    const TestComponentA = () => {
      const [suspenseRender, runTask] = useSuspenseRender<string>(undefined, "share error 2");
      useEffect(() => {
        runTask(async () => {
          return "Aaa";
        });
      }, [runTask]);
      return suspenseRender(
        (data, prevData) => {
          return (
            <button
              type="button"
              onClick={() => {
                runTask(async () => {
                  throw new Error("Error!");
                }).catch(() => {});
              }}
            >
              Success({data}
              {prevData ? `, ${prevData}` : ""})
            </button>
          );
        },
        <p>Loading</p>,
        (e) => <p>{(e as Error).message}</p>,
      );
    };
    const TestComponentB = () => {
      const [suspenseRender] = useSuspenseRender<string>(undefined, "share error 2");
      return suspenseRender(<p>Success</p>, <p>Loading</p>, (e) => <p>{(e as Error).message}</p>);
    };
    const componentA = ReactTestRender.create(<TestComponentA />);
    const componentAState = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
    expect(componentAState.children?.join("")).toEqual("Loading");
    await ReactTestRender.act(async () => {
      await delay(100 * 2);
      const componentAstate2 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate2.children?.join("")).toEqual("Success(Aaa)");
      componentAstate2.props.onClick();
      await delay(100 * 2);
      const componentAstate3 = componentA.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentAstate3.children?.join("")).toEqual("Error!");
      const componentB = ReactTestRender.create(<TestComponentB />);
      const componentBstate3 = componentB.toJSON() as ReactTestRender.ReactTestRendererJSON;
      expect(componentBstate3.children?.join("")).toEqual("Error!");
    });
  });
});
